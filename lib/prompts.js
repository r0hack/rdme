const semver = require('semver');

exports.generatePrompts = versionList => [
  {
    type: 'select',
    name: 'option',
    message: 'Would you like to use an existing version or create a new one to associate with your OAS file?',
    choices: [
      { message: 'Use existing', value: 'update' },
      { message: 'Create a new version', value: 'create' },
    ],
  },
  {
    type: 'select',
    name: 'versionSelection',
    message: 'Select your desired version',
    skip() {
      return this.enquirer.answers.option !== 'update';
    },
    choices: versionList.map(v => {
      return {
        message: v.version,
        value: v.version,
      };
    }),
  },
  {
    type: 'input',
    name: 'newVersion',
    message: "What's your new version?",
    skip() {
      return this.enquirer.answers.option === 'update';
    },
    hint: '1.0.0',
  },
];

exports.createOasPrompt = specList => [
  {
    type: 'select',
    name: 'option',
    message: 'Would you like to update an existing OAS file or create a new one?',
    choices: [
      { message: 'Update existing', value: 'update' },
      { message: 'Create a new spec', value: 'create' },
    ],
  },
  {
    type: 'select',
    name: 'specId',
    message: 'Select your desired file to update',
    skip() {
      return this.enquirer.answers.option !== 'update';
    },
    choices: specList.map(s => {
      return {
        message: s.title,
        value: s._id, // eslint-disable-line no-underscore-dangle
      };
    }),
  },
];

exports.createVersionPrompt = (versionList, opts, isUpdate) => [
  {
    type: 'select',
    name: 'from',
    message: 'Which version would you like to fork from?',
    skip() {
      return opts.fork || isUpdate;
    },
    choices: versionList.map(v => {
      return {
        message: v.version,
        value: v.version,
      };
    }),
  },
  {
    type: 'input',
    name: 'newVersion',
    message: "What's your new version?",
    skip() {
      return opts.newVersion || !isUpdate;
    },
    hint: '1.0.0',
    validate(val) {
      return semver.valid(semver.coerce(val)) ? true : this.styles.danger('Please specify a semantic version.');
    },
  },
  {
    type: 'confirm',
    name: 'is_stable',
    message: 'Would you like to make this version the main version for this project?',
    skip() {
      return opts.main || (isUpdate && isUpdate.is_stable);
    },
  },
  {
    type: 'confirm',
    name: 'is_beta',
    message: 'Should this version be in beta?',
    skip: () => opts.beta,
  },
  {
    type: 'confirm',
    name: 'is_hidden',
    message: 'Would you like to make this version public?',
    skip() {
      return opts.isPublic || opts.main || this.enquirer.answers.is_stable;
    },
  },
  {
    type: 'confirm',
    name: 'is_deprecated',
    message: 'Would you like to deprecate this version?',
    skip() {
      return opts.deprecated || opts.main || !isUpdate || this.enquirer.answers.is_stable;
    },
  },
];
