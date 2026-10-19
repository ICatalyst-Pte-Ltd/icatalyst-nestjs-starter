import { NAME } from './name.js';
import { regExpTests } from './regex.utils.spec.js';

regExpTests(
  'NAME',
  NAME,
  () => {
    const special = ['-', '_', ' ', '+'];
    return [
      { expected: false, value: '' },
      { expected: false, value: ' ' },
      ...special.map((value) => {
        return { expected: false, value: `${value}abc123` };
      }),
      ...special.map((value) => {
        return { expected: false, value: `abc123${value}` };
      }),
      { expected: true, value: 'abcdefghijklmnopqrstuvwxyz1234567890' },
      { expected: true, value: '1234567890' },
      ...special.map((value) => {
        return { expected: true, value: `abc${value}123` };
      }),
      { expected: true, value: 'éèëáàåäöčśžłíżńęøáýąóæšćôı' },
      { expected: true, value: 'τσιαιγολοχβςανنيرحبالтераб' },
      { expected: true, value: 'иневоаслкłјиневоцедањеволс' },
      { expected: true, value: 'рглсывызтоμςόκιναςόγο' },
      { expected: true, value: 'Иванов Василий Аксёнович' },
      { expected: true, value: 'అఆఇఈఉఊఋఌఎఏఐఒఓఔౠౡ' },
      { expected: true, value: 'కఖగఘఙచఛజఝఞటఠడఢణతథదధనపఫబభమయరఱలళవశషసహ' },
      { expected: true, value: 'ABC導字會' },
      { expected: true, value: 'ÜẞÖÄäöüß' },
      { expected: true, value: '爨馕貔貅饕餮龖' },
      { expected: true, value: 'Dependency Matrix (QQE)' },
      { expected: true, value: 'Aporia (linguistic) - Create a Paradox' },
      { expected: true, value: 'Aporia (aesthetic) - Performance & improv' },
    ];
  },
  true,
);
