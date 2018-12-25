
# coding: utf-8

"""
Firebase Kosher App API
"""

# * Database: [kappdb](https://console.firebase.google.com/project/kappdb-6fb1e/)
# * Documentation: https://firebase.google.com/docs/?authuser=0
# https://firebase.google.com/docs/firestore/
# * Get started with Cloud Firestore: https://firebase.google.com/docs/firestore/quickstart
# * Google credentials: https://cloud.google.com/docs/authentication/getting-started


project_public_facing_name = 'project-577134652655'
web_client_id = '577134652655-ffgruq15k5amjogc1j1lrrm17v28lvns.apps.googleusercontent.com'
web_client_secret = 'w3ziSiE7CIjKSaLykuuu48-M'

import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import pandas as pd

# Use a service account
cred = credentials.Certificate(
    'kappdb-6fb1e-firebase-adminsdk-f0djw-a410d6f533.json')

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


def nofProducts():
    return len(list(products_ref().get()))


def create(obj):
    """
    Creates a new document with a unique id and a timestamp.
    Returns: doc_ref
    """

    product_names = get_product_names()
    doc_ref = products_ref().document()

    if obj['product'].lower() not in product_names:
        obj['ts_created'] = firestore.SERVER_TIMESTAMP
        doc_ref.set(obj)
        print('+Product ({}) was created'.format(doc_ref.id))
    else:
        print('Product', obj['product'], 'already exists')

    return doc_ref


def batch_create(df):
    """
    Creates a set of products.
    """
    col_names = df.columns.tolist()
    product_names = get_product_names()

    for idx, p in df.iterrows():
        obj = {}
        for col_name in col_names:
            obj[col_name] = p[col_name]

        if p['product'].lower() not in product_names:
            doc_ref = products_ref().document()
            obj['ts_created'] = firestore.SERVER_TIMESTAMP
            doc_ref.set(obj)
            print(
                '+Product {} ({}) was created'.format(p['product'], doc_ref.id))
        else:
            print(obj['product'], 'already exists')


def get_doc(doc_ref):
    """Returns: A document as a dict."""

    return doc_ref.get().to_dict()


def update(doc_ref, obj):
    """
    Updates a document of it exists and is not deleted.
    Returns: doc_ref.
    """

    if not exists(doc_ref):
        err = 'Product ({}) does not exists'.format(doc_ref.id)
        print(err)
    elif(isDeleted(doc_ref)):
        err = 'Product ({}) is deleted and can not be updated'.format(
            doc_ref.id)
        print(err)
    else:
        obj['ts_modified'] = firestore.SERVER_TIMESTAMP
        doc_ref.update(obj)
        print('Product ({}) was modified'.format(doc_ref.id))

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
    prod_names = pd.Series(get_product_names(False))
    dups = prod_names[prod_names.duplicated()]
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


def get_product_names(to_lower=True):
    """
    Get all product names.
    Returns: list 
    """
    docs = products_ref().get()
    product_names = [
        doc.to_dict()['product']
        for doc in docs
        if 'product' in doc.to_dict()
    ]

    return [pn.lower() for pn in product_names] if to_lower else product_names


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
