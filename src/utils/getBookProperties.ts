import type { RouterOutputs } from './api';

export const userNamesForTypes: {[key: string]: string} = {
  'kindle': 'Kindle',
  'hardCover': 'Tapa Dura',
  'softCover':'Tapa Blanda',
  'pocketBook':'Libro de Bolsillo',
};

const getBookProperties = (book: RouterOutputs['books']['getBookBySlug'] | undefined) => {  
  const result: { [type: string]: { [property: string]: string } } = {};
  if (!book) {
    return result; 
  }
  book?.booksVersions.forEach((version) => {
    if (version.type) {
      const details: { [property: string]: string } = {};
      const typeName = userNamesForTypes[version.type] || version.type;
      if (!result[typeName]) {
        result[typeName] = details;
        if (version.type === 'kindle') {
          if (version.asin) {
            details['ASIN'] = version.asin;
          }
          if (version.fileSize) {
            details['Tamaño del archivo'] = `${version.fileSize} KB`;
          }
        } else {
          if (version.isbn10) {
            details['ISBN 10'] = version.isbn10;
          }
          if (version.isbn13) {
            details['ISBN 13'] = version.isbn13;
          }
          if (version.dimensions) {
            details['Dimensiones'] = version.dimensions;
          }
          if (version.dimensions) {
            details['Dimensiones'] = version.dimensions;
          }
          if (version.weight) {
            details['Peso'] = `${version.weight.toString()} gramos`;
          }
        }
        if (version.editionNumber) {
          details['Nº de edición'] = `${version.editionNumber}`;
        } 
        if (version.editionDate) {
          details['Fecha de edición'] = `${version.editionDate.toLocaleDateString('es-ES')}`;
        }
        if (version.pages) {
          details['Nº de páginas'] = `${version.pages}`;
        }
        if (version.amazonAffiliateURL) {
          details['_urlAmazon'] = version.amazonAffiliateURL;
        }
      }
    }
  });
  return result;
};

export default getBookProperties;
