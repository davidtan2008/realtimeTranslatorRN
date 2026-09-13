import { UtteranceAssembler } from './UtteranceAssembler';

describe('UtteranceAssembler', () => {
  it('locks Chinese as winner', () => {
    const assembler = new UtteranceAssembler();
    const result = assembler.ingest('zhHans', '我们六点见', true);
    expect(result?.language).toBe('zhHans');
    expect(result?.text).toBe('我们六点见');
  });

  it('rejects latin when claimed Chinese', () => {
    const assembler = new UtteranceAssembler();
    const result = assembler.ingest('zhHans', 'hello there friend', false);
    expect(result).toBeUndefined();
  });
});
