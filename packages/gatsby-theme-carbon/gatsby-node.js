const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');

exports.onPreBootstrap = ({ store, reporter }) => {
  const { program } = store.getState();

  const dirs = [
    path.join(program.directory, 'src/images'),
    path.join(program.directory, 'src/data'),
  ];

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      reporter.log(`creating the ${dir} directory`);
      mkdirp.sync(dir);
    }
  });
};

// We need to provide the actual file that created a specific page to append links for EditLink.
// We can't do page queries from MDX templates, so we'll add the page's relative path to context after it's created.
// The context object **is** supplied to MDX templates through the pageContext prop.
exports.onCreatePage = ({ page, actions }) => {
  const { createPage, deletePage } = actions;
  const [relativePagePath] = page.componentPath.split('src/pages').splice('-1');
  deletePage(page);
  createPage({
    ...page,
    context: {
      ...page.context,
      relativePagePath,
    },
  });
};
