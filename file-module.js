 import { join } from 'path';
import { readFile, writeFile } from 'fs/promises';

const filePath = join('./users.json');

 
export async function getData() {
  try {
    const data = await readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading file:', error);
    throw error;
  }
}

 
export async function setData(data) {
  try {
    await writeFile(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing file:', error);
  }
}
