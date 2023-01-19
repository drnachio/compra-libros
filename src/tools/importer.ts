import * as dotenv from 'dotenv';
import * as fs from 'node:fs/promises';
import type { MARKMetadata } from './markTypes';

dotenv.config();

const logSkippedFiles = false;

const contentImporter = async (): Promise<void> => {
  const files = await fs.readdir('data');
  let totalProcessed = 0;
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
        if (data.Contributor && !Array.isArray(data.Contributor)) {
          data.Contributor = [
            data.Contributor as unknown,
          ] as MARKMetadata['Contributor'];
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
                if (!data.Contributor) {
                  logSkippedFiles &&
                    console.error(`No contributor in ISBN ${file || ''}`);
                } else {
                  console.log(`Processing book ${file || ''}: ${mainTitle}`);
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
};

contentImporter()
  .then(() => {
    console.log('ok');
  })
  .catch((err) => {
    console.error(err);
  });
