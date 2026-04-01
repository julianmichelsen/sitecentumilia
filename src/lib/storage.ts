import { supabase } from './supabase';

/**
 * Faz o upload de um arquivo para o Supabase Storage
 * @param file O arquivo a ser enviado
 * @param bucket O nome do bucket (ex: 'media')
 * @returns A URL pública do arquivo
 */
export async function uploadMedia(file: File, bucket: string = 'media') {
  try {
    // Gerar um nome único para o arquivo para evitar sobreposição
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    // 1. Upload do arquivo
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    // 2. Pegar a URL pública
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Erro no upload:', error);
    throw error;
  }
}
