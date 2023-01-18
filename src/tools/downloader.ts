import fetch from 'node-fetch';
import * as dotenv from 'dotenv';
import { XMLParser } from 'fast-xml-parser';
import * as fs from 'node:fs/promises';

dotenv.config();

const contentDownloader = async (): Promise<void> => {
  if (process.env.BOOKS_LIST_URL) {
    const books = await fetch(process.env.BOOKS_LIST_URL);
    const list = await books.text();
    const parser = new XMLParser();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const listResult = (await parser.parse(list)) as {
      getRecordListXResponse: {
        records: {
          record: {
            id: string;
          }[];
        };
      };
    };
    const isbns = listResult.getRecordListXResponse.records.record.map(
      (c) => c.id,
    );
    await fs.writeFile('data/isbns.json', JSON.stringify(isbns, null, 2));
    if (process.env.BOOKS_DETAILS_URL) {
      for (let i = 0; i < isbns.length; i++) {
        const isbn = isbns[i];
        if (isbn) {
          console.log(`Fetching data for ${isbn}`);
          const url = `${process.env.BOOKS_DETAILS_URL}${isbn}`;
          const result = await fetch(url);
          const resultText = await result.text();
          const bookDetails = (await parser.parse(resultText)) as {
            getRecordsXResponse: {
              ONIXMessage: {
                Product: unknown;
              };
            };
          };
          await fs.writeFile(
            `data/${isbn}.json`,
            JSON.stringify(bookDetails.getRecordsXResponse.ONIXMessage.Product, null, 2),
          );
        }
      }
    } else {
      console.error(`No BOOKS_DETAILS_URL env setting`);
    }
  } else {
    console.error(`No BOOKS_LIST_URL env setting`);
  }
};

contentDownloader()
  .then(() => {
    console.log('ok');
  })
  .catch((err) => {
    console.error(err);
  });
