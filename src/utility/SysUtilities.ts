enum AssetGroup {
  template = 'layout',
  includes = 'includes',
  general = 'general',
  system = 'system',
}

const isSystemFolder = (path: string | undefined) => path ? path.startsWith('/_') : false;

const categoryFolders = [
  { category: AssetGroup.includes, folder: '_includes' },
  { category: AssetGroup.template, folder: '_layouts' },
];

const getCategoryFolder = (group: AssetGroup) => {
  const categoryFolder = categoryFolders.filter(v => v.category === group)[0];

  if (categoryFolder) {
    return categoryFolder.folder;
  } else {
    throw Error('Category folder not found for category' + group);
  }
};

const getCategory = (path: string) => {
  const rootFolder = path.split('/')[1];
  const categoryFolder = categoryFolders.filter(v => v.folder === rootFolder)[0];

  if (categoryFolder) {
    return categoryFolder.category;
  } else {
    if (isSystemFolder(path)) {
      return AssetGroup.system;
    } else {
      return AssetGroup.general;
    }
  }
};

export { AssetGroup, isSystemFolder, getCategory, getCategoryFolder };
