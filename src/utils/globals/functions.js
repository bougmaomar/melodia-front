import { API_MEDIA_URL } from 'config';
import parsePhoneNumberFromString from 'libphonenumber-js';

export const extractMinutesSecondsText = (totalDuration) => {
  const parts = totalDuration.split(':');
  const minutes = parts[0];
  const seconds = parts[1];
  return minutes != '00' ? `${minutes} min ${seconds} sec` : `${seconds} sec`;
};

export const extractMinutesSeconds = (totalDuration) => {
  const parts = totalDuration.split(':');
  const minutes = parts[0];
  const seconds = parts[1];
  return `${minutes}:${seconds}`;
};

export const formatDate1 = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatDate2 = (dateString) => {
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', options);
};

export const formatDateToInput = (date) => {
  return date.toISOString().split('T')[0];
};

export const formatPhone = (value) => {
  if (!value) return '';
  const phoneNumber = parsePhoneNumberFromString(value, 'CA');
  return phoneNumber ? phoneNumber.formatInternational() : value;
};

export const handleDownloadSong = async (file, role, putDownloads, songId, userId) => {
  try {
    const response = await fetch(`${API_MEDIA_URL}${file}`);
    console.log(`${API_MEDIA_URL}${file}`);
    if (!response.ok) {
      throw new Error('Failed to download the audio file');
    }

    const blob = await response.blob();
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', file.split('/').pop());
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    if (role == 'Station') {
      const res = await putDownloads(songId, userId);
      console.log(res);
    }
  } catch (error) {
    console.error(error);
  }
};

export const getTimeAgo = (date) => {
  const now = new Date();
  const timeDiff = now - new Date(date);

  const seconds = Math.floor(timeDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) return `il y a ${seconds} secondes`;
  if (minutes < 60) return `il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
  if (hours < 24) return `il y a ${hours} heure${hours > 1 ? 's' : ''}`;
  if (days < 30) return `il y a ${days} jour${days > 1 ? 's' : ''}`;
  if (months < 12) return `il y a ${months} mois`;
  return `il y a ${years} an${years > 1 ? 's' : ''}`;
};

export const getRoleColor = (role) => {
  switch (role) {
    case 'Artist':
      return '#42a5f5';
    case 'Agent':
      return '#ab47bc';
    case 'Station':
      return '#66bb6a';
    default:
      return '#bdbdbd';
  }
};
