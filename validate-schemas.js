#!/usr/bin/env node

const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// Initialize AJV with formats
const ajv = new Ajv({ allErrors: true, verbose: true });
addFormats(ajv);

// Load schemas
const appModuleSchema = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'src/schemas/app-module.schema.json'), 'utf8')
);
const cityAppSchema = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'src/schemas/city-app-schema.json'), 'utf8')
);

// Compile schemas
const validateAppModule = ajv.compile(appModuleSchema);
const validateCityApp = ajv.compile(cityAppSchema);

// Find all YAML files
function findYamlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findYamlFiles(filePath, fileList);
    } else if (file.endsWith('.yml') || file.endsWith('.yaml')) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

// Validate a YAML file
function validateYamlFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const data = yaml.load(content);

    // Determine which schema to use
    const isCityApp = filePath.includes('city_app.yml');
    const validator = isCityApp ? validateCityApp : validateAppModule;
    const schemaName = isCityApp ? 'city-app-schema' : 'app-module-schema';

    const valid = validator(data);

    return {
      filePath: filePath.replace(__dirname, ''),
      valid,
      schemaName,
      errors: valid ? null : validator.errors
    };
  } catch (error) {
    return {
      filePath: filePath.replace(__dirname, ''),
      valid: false,
      error: error.message
    };
  }
}

// Main validation
console.log('🔍 Validating YAML schemas in src/schemas...\n');

const appsDir = path.join(__dirname, 'public', 'apps');
const yamlFiles = findYamlFiles(appsDir);

console.log(`Found ${yamlFiles.length} YAML files\n`);

let totalValid = 0;
let totalInvalid = 0;
const issues = [];

yamlFiles.forEach(file => {
  const result = validateYamlFile(file);

  if (result.valid) {
    totalValid++;
    console.log(`✅ ${result.filePath} (${result.schemaName})`);
  } else {
    totalInvalid++;
    console.log(`❌ ${result.filePath} (${result.schemaName || 'parse error'})`);

    if (result.error) {
      console.log(`   Parse Error: ${result.error}`);
    } else if (result.errors) {
      result.errors.forEach(err => {
        const msg = `   ${err.instancePath || '/'} ${err.message}`;
        console.log(msg);
        if (err.params) {
          console.log(`   Params: ${JSON.stringify(err.params)}`);
        }
      });
    }
    console.log();

    issues.push(result);
  }
});

console.log('\n' + '='.repeat(60));
console.log(`📊 Summary:`);
console.log(`   ✅ Valid: ${totalValid}`);
console.log(`   ❌ Invalid: ${totalInvalid}`);
console.log(`   📁 Total: ${yamlFiles.length}`);
console.log('='.repeat(60));

if (totalInvalid > 0) {
  console.log('\n⚠️  Issues found in the following files:');
  issues.forEach(issue => {
    console.log(`\n   ${issue.filePath}`);
    if (issue.errors) {
      issue.errors.forEach(err => {
        console.log(`      • ${err.instancePath || '/'}: ${err.message}`);
      });
    }
  });
  process.exit(1);
} else {
  console.log('\n✨ All YAML files are valid!');
  process.exit(0);
}
