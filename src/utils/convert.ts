export const rankingTypeToText = (type: string | null) => {
  if (type === 'top100') return 'TOP100';
  if (type === 'rookie') return 'Rookie';
  if (type === 'remix') return 'REMIX';
  if (type === 'exhibition') return 'Exhibition';

  return null;
};
