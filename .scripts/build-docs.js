const fs = require('fs');
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

async function getSourceCode(id, filename) {
    const response = await fetch(`https://codesandbox.io/api/v1/sandboxes/${id}`, {
        method: 'GET'
    });
    const data = await response.json();

    if (!filename) return data.data.modules;

    return data.data.modules.find((file) => file.title === filename);
}

(async function() {
    const cmData = parse('./src/CalendarMonth.tsx')[0];
    const typesData = parse('./src/types.ts').reduce((p, c) => ({ ...p, [c.name]: c }), {});

    const cmSource = await getSourceCode('jjm94lyv53', 'SimpleDatePicker.tsx');

    const cmrSource = await getSourceCode('x90ozw987o', 'SimpleDateRangePicker.tsx');

    let cmDocs = `# \`<CalendarMonth/>\`

${cmData.description}

<details>
    <summary><b>Simple Date Picker Code Example</b></summary>

\`\`\`tsx
${cmSource.code}
\`\`\`

</details>

<br>

[![Edit Simple date-picker](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/jjm94lyv53?module=%2Fsrc%2FSimpleDatePicker.tsx)

<details>
    <summary><b>Simple Date Range Picker Code Example</b></summary>

\`\`\`tsx
${cmrSource.code}
\`\`\`

</details>

<br>

[![Edit simple date-range-picker](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/x90ozw987o?module=%2Fsrc%2FSimpleDateRangePicker.tsx)

## PropTypes\n\n`;

    cmDocs += makePropsTable(cmData.props);

    const cmSeeTags = getAllSeeTags(cmData.props, typesData);

    cmDocs += cmSeeTags
        .map((tag) => `### \`${tag}\`\n${makePropsTable(typesData[tag].props)}`)
        .join('\n\n');

    await writeFile('docs/CalendarMonth.md', cmDocs, 'utf8');

    /**********************************************************************************************************************/
    const drcData = parse('./src/DateRangeControl.tsx')[0];
    let drcDocs = `# \`<DateRangeControl/> \`

## PropTypes\n\n`;

    drcDocs += makePropsTable(drcData.props);
    drcDocs += '\n';

    await writeFile('test.json', JSON.stringify(drcData, null, 4), 'utf8');

    const drcSeeTags = getAllSeeTags(drcData.props, typesData);

    drcDocs += drcSeeTags
        .map((tag) => `### \`${tag}\`\n${makePropsTable(typesData[tag].props)}`)
        .join('\n\n');

    await writeFile('docs/DateRangeControl.md', drcDocs, 'utf8');
})();
