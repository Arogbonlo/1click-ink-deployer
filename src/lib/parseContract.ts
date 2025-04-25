import JSZip from 'jszip';

export async function parseContractMetadata(zip: JSZip): Promise<unknown> {
  const contractFile = Object.values(zip.files).find((f) =>
    f.name.endsWith('.contract')
  );
  if (!contractFile) throw new Error("Missing .contract file");

  const contractText = await contractFile.async('string');
  return JSON.parse(contractText);
}