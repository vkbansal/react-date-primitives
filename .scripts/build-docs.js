const fs = require('fs');
const path = require('path');
const util = require('util');

const writeFile = util.promisify(fs.writeFile);

const parse = require('react-ts-docs-parser').parse;

function makePropsTable(props) {
    const headers = ['prop', 'type', 'optional', 'description'].join(' | ');
    const seperator = headers.replace(/\w/g, '-');

    const rows = props.filter((prop) => prop.name !== 'children').map((props) => {
        let { name, type, required, description, tags } = props;

        description = description.replace(/\n/g, ' ');

        if (tags.see) {
            description += ` See [${tags.see}](#${tags.see.toLowerCase()})`;
        }

        return [`\`${name}\``, `\`${type}\``, required ? 'No' : 'Yes', description].join(' | ');
    });

    return '\n| ' + [headers, seperator, ...rows].join(' |\n| ') + ' |\n';
}

function getAllSeeTags(props, typesData) {
    const mainTags = props.map((prop) => prop.tags.see).filter(Boolean);
    if (mainTags.length <= 0) return [];

    mainTags.forEach((type) => {
        const data = typesData[type];

        mainTags.push(...getAllSeeTags(data.props, typesData));
    });

    return [...new Set(mainTags)];
}

(async function() {
    const cmData = parse(path.resolve(__dirname, '../src/components/CalendarMonth.tsx'))[0];
    const typesData = parse(path.resolve(__dirname, '../src/components/types.ts')).reduce((p, c) => ({ ...p, [c.name]: c }), {});

    let cmDocs = `# \`<CalendarMonth/>\`

${cmData.description}

## PropTypes\n\n`;

    cmDocs += makePropsTable(cmData.props);

    const cmSeeTags = getAllSeeTags(cmData.props, typesData);

    cmDocs += cmSeeTags
        .map((tag) => `### \`${tag}\`\n${makePropsTable(typesData[tag].props)}`)
        .join('\n\n');

    await writeFile(path.resolve(__dirname, '../docs/CalendarMonth.md'), cmDocs, 'utf8');

    /**********************************************************************************************************************/
    const drcData = parse(path.resolve(__dirname, '../src/components/DateRangeControl.tsx'))[0];
    let drcDocs = `# \`<DateRangeControl/> \`

${drcData.description}

## PropTypes\n\n`;

    drcDocs += makePropsTable(drcData.props);
    drcDocs += '\n';

    const drcSeeTags = getAllSeeTags(drcData.props, typesData);

    drcDocs += drcSeeTags
        .map((tag) => `### \`${tag}\`\n${makePropsTable(typesData[tag].props)}`)
        .join('\n\n');

    await writeFile(path.resolve(__dirname, '../docs/DateRangeControl.md'), drcDocs, 'utf8');
})();
