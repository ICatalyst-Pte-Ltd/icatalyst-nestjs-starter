import { clean } from './clean.js';

describe(clean.name, () => {
  it.each([
    { value: '', expected: '' },
    {
      value:
        '<a href=https://example.com/ id=id1 name=name1 target=_blank>anchor tag</a>',
      expected:
        '<a href="https://example.com/" id="id1" name="name1" target="_blank">anchor tag</a>',
    },
    {
      value: '<base href=https://www.google.com/ target=_blank>',
      expected: '',
      // expected: '&lt;base href=https://www.google.com/ target=_blank&gt;',
    },
    {
      value: '<bdo dir=rtl></bdo>',
      expected: '',
      // expected: '&lt;bdo dir=rtl&gt;&lt;/bdo&gt;',
    },
    {
      value: '<br id=id1 name=name1>',
      expected: '<br id="id1" name="name1" />',
    },
    {
      value: '<col span=2>',
      expected: '',
      // expected: '&lt;col span=2&gt;'
    },
    {
      value: '<data value=21053>',
      expected: '',
      // expected: '&lt;data value=21053&gt;',
    },
    {
      value: '<embed src=test.jpg type=image/jpg>',
      expected: '',
      // expected: '&lt;embed src=test.jpg type=image/jpg&gt;',
    },
    {
      value:
        '<iframe height=300 id=id1 name=name1 src=x title=Test width=300>iframe tag</iframe>',
      expected:
        '<iframe height="300" id="id1" name="name1" src="x" width="300">iframe tag</iframe>',
    },
    {
      value: "<img alt=alt id=id1 name=name1 src=x onerror=alert('xss');>",
      expected: '<img alt="alt" id="id1" name="name1" src="x" />',
    },
    {
      value:
        '<source id=id1 media=(min-width:650px) name=name1 src=a.png srcset=a.jpg type=audio/ogg>',
      expected:
        '<source id="id1" media="(min-width:650px)" name="name1" srcset="a.jpg"></source>',
    },
    { value: [], expected: [] },
    {
      value: [
        '',
        'test',
        '<a href=https://example.com/>anchor tag</a>',
        { text: '<a href=https://example.com/>anchor tag</a>' },
        null,
        undefined,
        [
          '',
          'test',
          '<a href=https://example.com/>anchor tag</a>',
          { text: '<a href=https://example.com/>anchor tag</a>' },
          null,
          undefined,
        ],
      ],
      expected: [
        '',
        'test',
        '<a href="https://example.com/">anchor tag</a>',
        { text: '<a href="https://example.com/">anchor tag</a>' },
        null,
        undefined,
        [
          '',
          'test',
          '<a href="https://example.com/">anchor tag</a>',
          { text: '<a href="https://example.com/">anchor tag</a>' },
          null,
          undefined,
        ],
      ],
    },
    { value: {}, expected: {} },
    {
      value: {
        '': '',
        text: '<a href=https://example.com/>anchor tag</a>',
        '<a href=https://example.com/>anchor tag</a>': '',
        array: ['<a href=https://example.com/>anchor tag</a>'],
        null: null,
        undefined: undefined,
        object: {
          '': '',
          text: '<a href=https://example.com/>anchor tag</a>',
          '<a href=https://example.com/>anchor tag</a>': '',
          array: ['<a href=https://example.com/>anchor tag</a>'],
          null: null,
          undefined: undefined,
        },
      },
      expected: {
        '': '',
        text: '<a href="https://example.com/">anchor tag</a>',
        '<a href="https://example.com/">anchor tag</a>': '',
        array: ['<a href="https://example.com/">anchor tag</a>'],
        null: null,
        undefined: undefined,
        object: {
          '': '',
          text: '<a href="https://example.com/">anchor tag</a>',
          '<a href="https://example.com/">anchor tag</a>': '',
          array: ['<a href="https://example.com/">anchor tag</a>'],
          null: null,
          undefined: undefined,
        },
      },
    },
  ])('$#: should sanitize `$value`', ({ value, expected }) => {
    const result = clean(value);

    expect(result).toEqual(expected);
  });
});
