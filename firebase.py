import firebase_admin
from firebase_admin import credentials, firestore
import json
import datetime
import pandas as pd

key_file = "C:/Users/Zrin/source/repos/stella-zrin-wedding-856fcb5ae559.json"
cred = credentials.Certificate(key_file)
firebase_admin.initialize_app(cred)

firestore_client = firestore.client()

collection_name = 'guests'
documents = firestore_client.collection(collection_name).stream()

data = []
for doc in documents:
    doc_data = doc.to_dict()
    filtered_data = {
        'firstName': doc_data.get('firstName', ''),
        'lastName': doc_data.get('lastName', ''),
        'isComing': doc_data.get('isComing', False)
    }
    data.append(filtered_data)

timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")

df = pd.DataFrame(data)

column_mapping = {
    'firstName': 'Ime',
    'lastName': 'Prezime',
    'isComing': 'Dolazi'
}

df.rename(columns=column_mapping, inplace=True)

df['Dolazi'] = df['Dolazi'].apply(lambda x: 'Dolazi' if x else 'Ne dolazi')

excel_file = f'Gosti-Spisak_{timestamp}.xlsx'

df.to_excel(excel_file, index=False, engine='openpyxl')

print(f"Data has been exported to {excel_file}")