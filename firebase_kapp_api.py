"""
Firebase Kosher App API
"""

import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import pandas as pd

# Use a service account
cred = credentials.Certificate(
    '../kappdb-6fb1e-firebase-adminsdk-f0djw-705b7fe26e.json')

# Note: Only call this once
firebase_admin.initialize_app(cred)

db = firestore.client()


def products_ref():
    """
    Returns: The Firebase reference for the products collection.
    """
    return db.collection(u'products')


def get_doc_ref(id):
    doc_ref = products_ref().document(id)
    if not exists(doc_ref):
        print('Product ({}) does not exists'.format(doc_ref.id))
    return doc_ref


def isDeleted(doc_ref):
    """
    Checks if document is logically deleted, i.e. has a deleted timestamp.
    Returns: boolean
    """

    return exists(doc_ref) and 'ts_deleted' in get_doc(doc_ref)


def exists(doc_ref):
    """
    Checks if document exitst is the database.
    Returns: boolean
    """

    return doc_ref.get().exists


def is_unique(obj, unique_names):
    """
    Checks is a unique name (producer + product) doesn't already exists.
    """
    return obj['producer'].lower() + "_" + obj['product'].lower().replace('/', ' ') not in unique_names


def get_unique_name(obj):
    """
    Creates a unique name (hopefully) of producer and product.
    """
    return obj['producer'].lower() + "_" + obj['product'].lower().replace('/', ' ')


def nofProducts():
    return len(list(products_ref().get()))


def create(obj):
    """
    Creates a new document with a unique id and a timestamp.
    Returns: doc_ref
    """

    doc_ref = products_ref().document(get_unique_name(obj))

    if is_unique(obj, get_unique_names()):
        obj['ts_created'] = firestore.SERVER_TIMESTAMP
        obj['product'] = obj['product'].replace('/', ' ')

        doc_ref.set(obj)
        print('+ {}'.format(doc_ref.id))
    else:
        print("x", get_unique_name(obj), 'already exists')

    return doc_ref


def batch_create(df):
    """
    Creates a set of products.
    """
    col_names = df.columns.tolist()
    unique_names = get_unique_names()

    for idx, p in df.iterrows():
        obj = {}
        for col_name in col_names:
            obj[col_name] = p[col_name]

        if is_unique(obj, unique_names):
            obj['ts_created'] = firestore.SERVER_TIMESTAMP
            obj['product'] = obj['product'].replace('/', ' ')

            doc_ref = products_ref().document(get_unique_name(obj))
            doc_ref.set(obj)
            print(
                '+ {}'.format(doc_ref.id))
        else:
            print("x", get_unique_name(obj), 'already exists')


def get_doc(doc_ref):
    """Returns: A document as a dict."""
    return doc_ref.get().to_dict()


def get_docs():
    """
    Returns: All of them documents.
    """
    docs = products_ref().get()  # This is a firestore.document.DocumentSnapshot
    products = []
    for doc in docs:
        products.append(doc.to_dict())
    return products


def update(doc_ref, obj):
    """
    Updates a document of it exists and is not deleted.
    Returns: doc_ref.
    """

    if not exists(doc_ref):
        err = '{} does not exists'.format(doc_ref.id)
        print(err)
    elif(isDeleted(doc_ref)):
        err = '{} is deleted and can not be updated'.format(
            doc_ref.id)
        print(err)
    else:
        obj['ts_modified'] = firestore.SERVER_TIMESTAMP
        doc_ref.update(obj)
        print('{} was modified'.format(doc_ref.id))

    return doc_ref


def delete(doc_ref):
    """
    Logical delete.
    Returns: doc_ref
    """

    # if not isDeleted(doc_ref):
    obj = {'ts_deleted': firestore.SERVER_TIMESTAMP}
    update(doc_ref, obj)
    return doc_ref


def erase(doc_ref):
    """
    Removes the documents from the database.
    Returns: doc_ref
    """

    doc_ref.delete()
    return doc_ref


def find_duplicates():
    """
    Finds duplicates in the Firestore database by product.
    Returns: A tuple of (id, product name)
    """
    unique_names = pd.Series(get_unique_names(False))
    dups = unique_names[unique_names.duplicated()]
    prod_ref = products_ref()

    dup_res = []

    for dup in dups:
        query = prod_ref.where(u'product', u'==', dup)
        dup_res.append([(d.id, d.to_dict()['product'])
                        for d in query.get()][0])

    return dup_res


def erase_duplicates():
    for d in find_duplicates():
        erase(get_doc_ref(d[0]))
        print('Duplicate product {} ({}) was erased.'.format(d[1], d[0]))


def get_unique_names(to_lower=True):
    """
    Get all product names.
    Returns: list 
    """
    docs = products_ref().get()
    unique_names = [
        doc.to_dict()['producer'] + "_" + doc.to_dict()['product']
        for doc in docs
        if 'producer' in doc.to_dict() and 'product' in doc.to_dict()
    ]

    return [pn.lower() for pn in unique_names] if to_lower else unique_names


def list_products(verbose=True):
    """Lists all products."""

    docs = products_ref().get()  # This is a firestore.document.DocumentSnapshot
    for doc in docs:
        if verbose:
            print('id:{}'.format(doc.id))
            pp(doc.reference)
        else:
            print('id:{}\nproduct:{}\n'.format(
                doc.id,
                doc.to_dict()['product'] if 'product' in doc.to_dict(
                ) else 'MISSING PRODUCT KEY'
            ))


def pp(doc_ref):
    """
    A simple one-level pretty print.
    Returns: doc_ref
    """
    if exists(doc_ref):
        doc = get_doc(doc_ref)
        keys = [len(k) for k in doc.keys()]
        max_len = max(keys) if keys else 5

        for key in sorted(list(doc.keys()), key=str.lower):
            print('{:{width}} : {}'.format(key, doc[key], width=max_len))
        print('---')
    return doc_ref
