import JSZip from 'jszip';

export async function parseContractMetadata(zip: JSZip): Promise<any> {
  const metadataFile = zip.file('metadata.json');
  if (!metadataFile) throw new Error("Missing metadata.json");

  const metadataText = await metadataFile.async('string');
  return JSON.parse(metadataText);
}
