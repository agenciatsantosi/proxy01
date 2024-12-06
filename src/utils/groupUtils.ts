interface GroupInfo {
  mainCategory: string;
  subCategory: string;
}

export function parseGroupTitle(groupTitle: string): GroupInfo {
  // Remove espaços extras e caracteres especiais
  const cleanTitle = groupTitle.trim().replace(/[|]/g, '').trim();
  
  // Separa em categoria principal e subcategoria
  const parts = cleanTitle.split(/\s*\|\s*/);
  
  if (parts.length > 1) {
    return {
      mainCategory: parts[0].trim(),
      subCategory: parts[1].trim()
    };
  }

  return {
    mainCategory: cleanTitle,
    subCategory: 'Geral'
  };
}

export function organizeChannelsByGroup(channels: Channel[]): Record<string, Record<string, Channel[]>> {
  return channels.reduce((acc, channel) => {
    if (!channel.group) return acc;

    const { mainCategory, subCategory } = parseGroupTitle(channel.group);

    if (!acc[mainCategory]) {
      acc[mainCategory] = {};
    }
    if (!acc[mainCategory][subCategory]) {
      acc[mainCategory][subCategory] = [];
    }

    acc[mainCategory][subCategory].push(channel);
    return acc;
  }, {} as Record<string, Record<string, Channel[]>>);
} 