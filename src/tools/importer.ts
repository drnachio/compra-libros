import * as dotenv from 'dotenv';
import * as fs from 'node:fs/promises';
import type { MARKMetadata } from './markTypes';

const notDirectRelationCodes = [2, 24, 25, 22, 23, 30, 45];

dotenv.config();

const logSkippedFiles = false;

const getDateFromMARCNumber = (dateNumber: number): Date => {
  const stringDate = `${dateNumber}`;
  return new Date(
    stringDate.substring(0, 4) +
      '-' +
      stringDate.substring(4, 6) +
      '-' +
      stringDate.substring(6),
  );
};

const contentImporter = async (): Promise<void> => {
  const files = await fs.readdir('data');
  let totalProcessed = 0;
  const bookDictionary = new Map<number, MARKMetadata>();
  const contents = new Array<{
    isbns: number[];
    datas: MARKMetadata[];
  }>();
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (file && file.endsWith('.json') && file.length === 22) {
      try {
        const fileContent = await fs.readFile(`data/${file}`, 'utf-8');
        const data = JSON.parse(fileContent) as MARKMetadata;
        if (data.MainSubject && !Array.isArray(data.MainSubject)) {
          data.MainSubject = [
            data.MainSubject as unknown,
          ] as MARKMetadata['MainSubject'];
        }
        if (data.Series && !Array.isArray(data.Series)) {
          data.Series = [data.Series as unknown] as MARKMetadata['Series'];
        }
        if (data.Contributor && !Array.isArray(data.Contributor)) {
          data.Contributor = [
            data.Contributor as unknown,
          ] as MARKMetadata['Contributor'];
        }
        if (data.Language && !Array.isArray(data.Language)) {
          data.Language = [
            data.Language as unknown,
          ] as MARKMetadata['Language'];
        }
        if (data.Extent && !Array.isArray(data.Extent)) {
          data.Extent = [data.Extent as unknown] as MARKMetadata['Extent'];
        }
        if (data.Subject && !Array.isArray(data.Subject)) {
          data.Subject = [data.Subject as unknown] as MARKMetadata['Subject'];
        }
        if (data.OtherText && !Array.isArray(data.OtherText)) {
          data.OtherText = [
            data.OtherText as unknown,
          ] as MARKMetadata['OtherText'];
        }
        if (data.Publisher && !Array.isArray(data.Publisher)) {
          data.Publisher = [
            data.Publisher as unknown,
          ] as MARKMetadata['Publisher'];
        }
        if (data.Publisher) {
          data.Publisher.forEach((publisher) => {
            if (publisher.Website && !Array.isArray(publisher.Website)) {
              publisher.Website = [
                publisher.Website as unknown,
              ] as MARKMetadata['Publisher'][number]['Website'];
            }
          });
        }
        if (data.MediaFile && !Array.isArray(data.MediaFile)) {
          data.MediaFile = [
            data.MediaFile as unknown,
          ] as MARKMetadata['MediaFile'];
        }
        if (data.SalesRights && !Array.isArray(data.SalesRights)) {
          data.SalesRights = [
            data.SalesRights as unknown,
          ] as MARKMetadata['SalesRights'];
        }
        if (data.Measure && !Array.isArray(data.Measure)) {
          data.Measure = [data.Measure as unknown] as MARKMetadata['Measure'];
        }
        if (data.RelatedProduct && !Array.isArray(data.RelatedProduct)) {
          data.RelatedProduct = [
            data.RelatedProduct as unknown,
          ] as MARKMetadata['RelatedProduct'];
        }
        if (data.RelatedProduct) {
          data.RelatedProduct.forEach((relatedProduct) => {
            if (
              relatedProduct.ProductIdentifier &&
              !Array.isArray(relatedProduct.ProductIdentifier)
            ) {
              relatedProduct.ProductIdentifier = [
                relatedProduct.ProductIdentifier as unknown,
              ] as MARKMetadata['RelatedProduct'][number]['ProductIdentifier'];
            }
          });
        }
        if (data.SupplyDetail && !Array.isArray(data.SupplyDetail)) {
          data.SupplyDetail = [
            data.SupplyDetail as unknown,
          ] as MARKMetadata['SupplyDetail'];
        }
        if (data.SupplyDetail) {
          data.SupplyDetail.forEach((supply) => {
            if (supply.Price && !Array.isArray(supply.Price)) {
              supply.Price = [
                supply.Price as unknown,
              ] as MARKMetadata['SupplyDetail'][number]['Price'];
            }
          });
        }
        if (data.Title) {
          if (data.Title && !Array.isArray(data.Title)) {
            data.Title = [data.Title as unknown] as MARKMetadata['Title'];
          }
          const mainTitle = `${
            data.Title.find((c) => c.TitleType === 1)?.TitleText || ''
          }`;
          if (!mainTitle) {
            logSkippedFiles && console.error(`No tittle in ISBN ${file || ''}`);
          } else if (
            mainTitle.indexOf(' ') !== -1 &&
            mainTitle.trim() === mainTitle.trim().toUpperCase()
          ) {
            // Not screaming tittles allowed
            logSkippedFiles &&
              console.log(
                `Screaming tittle in ISBN ${file || ''} ${mainTitle}`,
              );
          } else if (mainTitle.indexOf('&#') !== -1) {
            // Not unicode scaped tittles allowed
            logSkippedFiles &&
              console.log(
                `Unicode scaped title in ISBN ${file || ''} ${mainTitle}`,
              );
          } else {
            if (!data.MainSubject) {
              logSkippedFiles &&
                console.log(`No subjects in file ${file || ''}...`);
            } else {
              if (
                data.MainSubject.some((c) => `${c.SubjectCode}`.startsWith('F'))
              ) {
                if (!data.Contributor || data.Contributor.length === 0) {
                  logSkippedFiles &&
                    console.error(`No contributor in ISBN ${file || ''}`);
                } else if (!data.Contributor[0]?.BiographicalNote) {
                  logSkippedFiles &&
                    console.error(
                      `No Bio For Contributor File in ISBN ${file || ''}`,
                    );
                } else if (!data.Contributor[0]?.PersonNameInverted) {
                  logSkippedFiles &&
                    console.error(
                      `No Personal Name Inverted File in ISBN ${file || ''}`,
                    );
                } else if (!data.MediaFile || data.MediaFile.length === 0) {
                  logSkippedFiles &&
                    console.error(`No Media File in ISBN ${file || ''}`);
                } else if (
                  !data.MediaFile.find((c) => c.MediaFileTypeCode === 4)
                    ?.MediaFileLink
                ) {
                  logSkippedFiles &&
                    console.error(`No Cover Image in ISBN ${file || ''}`);
                } else if (!data.OtherText || data.OtherText.length === 0) {
                  logSkippedFiles &&
                    console.error(`No OtherText in ISBN ${file || ''}`);
                } else if (
                  !data.Publisher ||
                  data.Publisher.length === 0 ||
                  !data?.Publisher[0]?.PublisherName ||
                  !data?.Publisher[0]?.NameCodeValue
                ) {
                  logSkippedFiles &&
                    console.error(`No Publisher in ISBN ${file || ''}`);
                } else if (
                  !data.ProductIdentifier ||
                  data.ProductIdentifier.length === 0 ||
                  data.ProductIdentifier.filter((c) => c.ProductIDType === 15)
                    ?.length !== 1 ||
                  !data.ProductIdentifier.find((c) => c.ProductIDType === 15)
                    ?.IDValue
                ) {
                  console.error(`No ISBN 13 in ISBN ${file || ''}`);
                } else if (
                  !data.SupplyDetail ||
                  data.SupplyDetail.length === 0
                ) {
                  logSkippedFiles &&
                    console.error(`No SupplyDetail in ISBN ${file || ''}`);
                } else if (data.PublishingStatus !== 4) {
                  logSkippedFiles &&
                    console.error(`Not published in ISBN ${file || ''}`);
                } else if (!data.PublicationDate) {
                  logSkippedFiles &&
                    console.error(`No publication date in ISBN ${file || ''}`);
                } else if (
                  getDateFromMARCNumber(data.PublicationDate) > new Date()
                ) {
                  logSkippedFiles &&
                    console.error(`Not published ISBN ${file || ''}`);
                } else if (
                  data.SupplyDetail.find(
                    (c) =>
                      c.SupplyToCountry &&
                      c.SupplyToCountry.indexOf('ES') !== -1,
                  )?.Price.length === 0
                ) {
                  logSkippedFiles &&
                    console.error(`No price for ES in ISBN ${file || ''}`);
                } else {
                  const isbn15 =
                    data.ProductIdentifier.find((c) => c.ProductIDType === 15)
                      ?.IDValue || 0;
                  if (bookDictionary.has(isbn15)) {
                    console.error(`Duplicated ISBN15 ${isbn15}...`);
                  }
                  bookDictionary.set(isbn15, data);
                  // console.log(`Processing book ${file || ''}: ${mainTitle}`);
                  const isbns = new Array<number>();
                  isbns.push(isbn15);
                  let previousContent = contents.findIndex((content) =>
                    content.isbns.includes(isbn15),
                  );
                  if (previousContent === -1 && data.RelatedProduct) {
                    data.RelatedProduct.forEach((related) => {
                      if (
                        related.RelationCode &&
                        !notDirectRelationCodes.includes(related.RelationCode)
                      ) {
                        const relatedIsbn = related.ProductIdentifier.find(
                          (c) =>
                            c.ProductIDType === 3 || c.ProductIDType === 15,
                        )?.IDValue;
                        if (relatedIsbn) {
                          if (!isbns.includes(relatedIsbn)) {
                            isbns.push(relatedIsbn);
                          }
                          const newIndex = contents.findIndex((content) =>
                            content.isbns.includes(relatedIsbn),
                          );
                          if (previousContent === -1) {
                            previousContent = newIndex;
                          } else if (
                            newIndex !== -1 &&
                            newIndex !== previousContent
                          ) {
                            console.log(
                              `Unusual double relation ${relatedIsbn} in ${
                                file || ''
                              }`,
                            );
                          }
                        }
                      }
                    });
                  }
                  if (previousContent === -1) {
                    contents.push({
                      isbns,
                      datas: [data],
                    });
                  } else {
                    const previous = contents[previousContent];
                    if (previous) {
                      previous.datas.push(data);
                      isbns.forEach((isbn) => {
                        if (!previous.isbns.includes(isbn)) {
                          previous.isbns.push(isbn);
                        }
                      });
                    }
                  }
                  totalProcessed++;
                }
              } else {
                logSkippedFiles && console.log(`${mainTitle} is not fiction`);
              }
            }
          }
        } else {
          logSkippedFiles &&
            console.error(`No tittle node in ISBN ${file || ''}`);
        }
      } catch (err) {
        console.log(`Error in ${file || ''}...`);
        throw err;
      }
    } else {
      logSkippedFiles && console.log(`Skipping ${file || ''}...`);
    }
  }
  console.log(`Total fiction books to process: ${totalProcessed}`);
  console.log(`${contents.length} unique contents`);
  const list = contents.map((c) =>
    c.datas.reduce<string[]>((t, b): string[] => {
      if (!t.includes(`${b.Title?.[0]?.TitleText || ''}`)) {
        t.push(`${b.Title?.[0]?.TitleText || ''}`);
      }
      return t;
    }, new Array<string>()),
  );
  list.sort((a, b) => a[0]?.localeCompare(b[0] || '') || 0);
  console.table(list);
};

contentImporter()
  .then(() => {
    console.log('ok');
  })
  .catch((err) => {
    console.error(err);
  });
