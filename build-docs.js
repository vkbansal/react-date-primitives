const fs = require('fs');
const util = require('util');

const writeFile = util.promisify(fs.writeFile);

const fetch = require('node-fetch');
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

async function getSourceCode(url, filename) {
    const response = await fetch(url, { method: 'GET' });
    const data = await response.json();

    if (!filename) return data.data.modules;

    return data.data.modules.find((file) => file.title === filename);
}

(async function() {
    const cmData = parse('./src/CalendarMonth.tsx')[0];
    const typesData = parse('./src/types.ts').reduce((p, c) => ({ ...p, [c.name]: c }), {});

    const cmSource = await getSourceCode(
        'https://codesandbox.io/api/v1/sandboxes/jjm94lyv53',
        'SimpleDatePicker.tsx'
    );

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

## PropTypes
`;

    cmDocs += makePropsTable(cmData.props);

    const seeTags = getAllSeeTags(cmData.props, typesData);

    cmDocs += seeTags
        .map((tag) => {
            return `
### \`${tag}\`

${makePropsTable(typesData[tag].props)}
        `;
        })
        .join('\n\n');

    await writeFile('docs/CalendarMonth.md', cmDocs, 'utf8');
})();
