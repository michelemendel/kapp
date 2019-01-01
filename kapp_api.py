import pandas as pd
import datetime
import time
import json
import math
from hashlib import md5
import pamda as p

"""
Database using FlataDB

1. ON-TIME: Reads a set of CSV files and - using FlataDB - creates a JavaScript file with an array of objects.
2. CRUDS will be done with the FlataDB after step 1 is done.

Small document databases
https://tinydb.readthedocs.io/en/latest/
https://github.com/harryho/flata
https://blog.ruanbekker.com/blog/2018/04/15/experimenting-with-python-and-flata-the-lightweight-document-orientated-database/
"""

metadata_file = 'metadata.json'
data_file = 'public/data.js'
database_file = 'database.json'
DATETIME_FORMAT = '%Y.%m.%dT%H:%M:%S%z'

# FlataDB
from flata import Flata, Query, where
from flata.storages import JSONStorage
db = Flata(database_file, storage=JSONStorage)
q = Query()

# Init
metadata_uid = 1
metadataTable = db.table('metadata', id_field='uid')
recordsTable = db.table('records', id_field='uid')


def get_db():
    return db


# So we don't need to write strings
category = 'category'
sub_category = 'sub_category'
producer = 'producer'
product_type = 'product_type'
product = 'product'
kosher_type = 'kosher_type'
kosher_stamp = 'kosher_stamp'
comment = 'comment'
#
search = 'search'
ts_created = 'ts_created'
ts_modified = 'ts_modified'
fingerprint = 'fingerprint'
version = 'version'
uid = 'uid'

search_keys = ['category', 'sub_category', 'producer',
               'product_type', 'product', 'kosher_type', 'kosher_stamp', 'comment']


def log(msg, data=""):
    print("[]:{}:{}".format(msg, data))


def ts_now():
    return time.strftime(DATETIME_FORMAT, time.localtime())


def hashit(str):
    return md5(str.encode()).hexdigest()


def read_json(filename):
    """
    Returns: A dict
    """
    with open(filename, "r") as read_file:
        data = json.load(read_file)
    return data


def save_file(filename, data):
    log('Saving', filename)
    print(data, file=open(filename, 'w'))


def read_data(csv_file):
    """
    Local
    Also presents some information about the data.
    Returns: A Panda DataFrame.
    """
    log("Reading", csv_file)
    df = pd.read_csv(csv_file)
    return df


def count_products(csv_files):
    """
    Count products in CSV files.
    Returns: Number of products in a set of CSV files.
    """
    log("Count Products")
    csv_filen_length = []
    csv_lengths_sum = 0
    for k, v in csv_files.items():
        df_len = len(pd.read_csv('data/' + v))
        csv_lengths_sum = csv_lengths_sum + df_len
        csv_filen_length.append((v, df_len))

    return csv_lengths_sum, csv_filen_length


def find_duplicates(df):
    """
    Find duplicates in a dataframe (local data from CSV files).
    Duplicates is checked on producer+product.
    Returns: A DataFrame with duplicates.
    """
    log('Finding Duplicates')
    dups = df.duplicated(subset=['producer', 'product'], keep=False)
    df_dups = df[dups].sort_values(by=['producer', 'product'])
    return df_dups


def find_duplicates_all(csv_files):
    """
    See find_duplicates()
    Returns: A DataFrame with duplicates.
    """
    df = pd.DataFrame()
    for k, v in csv_files.items():
        df = pd.concat([df, read_data('data/' + v)], ignore_index=True)
    return find_duplicates(df)


def get_meta_data():
    return metadataTable.search(q.uid == metadata_uid)[0]


def get_updated_minor_version():
    curr = get_meta_data()[version].split('.')
    major, minor = curr[0], curr[1]
    new = major + "." + str(int(minor) + 1)
    return new


def update_meta_data():
    metadataTable.update({
        version: get_updated_minor_version(),
        ts_modified: ts_now()
    }, where(uid) == metadata_uid)


def enrich_records(row):
    """
    Adds an extra column so search will be easier.
    You can then use regex over a set of keys.
    Input: A row as a dict.
    Returns: The enriched row.
    """
    row['search'] = " ".join([row[key] for key in search_keys if key in row])
    row['fingerprint'] = hashit(row['search'])
    return row


def exists(curr_uid):
    return True if recordsTable.search(q.uid == curr_uid) else False


def read(curr_uid=0):
    """
    Input: id
    Returns: A single record as a dict.
    """
    return (recordsTable.search(q.uid == curr_uid)[0]
            if exists(curr_uid)
            else {}
            )


def insert(row):
    """
    Insert into FlataDB.
    Input: A row as a dict.
    """
    row[ts_created] = ts_now()
    enrich_records(row)
    r = recordsTable.insert(row)
    return r


def update(curr_uid, new_obj):
    """
    Updates a row in FlataDB.
    Input: uid, a new object row as a dict.
    """
    if exists(curr_uid):
        curr = recordsTable.search(q.uid == curr_uid)[0]
        curr[ts_modified] = ts_now()
        recordsTable.update(
            enrich_records({**curr, **new_obj}),
            where(uid) == curr_uid
        )


def delete(curr_uids):
    """
    Input: uid
    """
    ids_to_delete = p.flatten([curr_uids])

    print(ids_to_delete)

    for id_to_delete in ids_to_delete:
        if exists(id_to_delete):
            recordsTable.remove(ids=[id_to_delete])


def get_search():
    return Query(), recordsTable


def create_public_data_file():
    data = (
        'const data = {'
        + '"metadata":' + json.dumps(get_meta_data())
        + ', "records":' + json.dumps(recordsTable.all())
        + '}'
    )
    save_file(data_file, data)


def one_time_create_flata_db_from_csvs(csv_files):
    """
    SHOULD ONLY BE RUN ONCE
    WILL DESTROY THE EXISTING DATABASE
    """
    df = pd.DataFrame()
    for k, v in csv_files.items():
        records = read_data('data/' + v)
        df = pd.concat([df, records], ignore_index=True)

    # Purge all records and insert them
    recordsTable.purge()
    for index, row in df.iterrows():
        insert(row.to_dict())
