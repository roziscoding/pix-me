const { expect } = require('chai')
const { pix } = require('../dist')

describe('pix', () => {
  it('Generates valid PIX codes', () => {
    expect(
      pix({
        key: '26385709906',
        amount: '1234.00',
        city: 'Cidade',
        name: 'FULANO DE TAL',
        reusable: true
      })
    ).to.equal(
      '00020101021126330014br.gov.bcb.pix01112638570990652040000530398654071234.005802BR5913FULANO DE TAL6006Cidade63041923'
    )

    expect(
      pix({
        key: '26385709906',
        amount: '1234.00',
        city: 'Cidade',
        name: 'FULANO DE TAL',
        reusable: false
      })
    ).to.equal(
      '00020101021226330014br.gov.bcb.pix01112638570990652040000530398654071234.005802BR5913FULANO DE TAL6006Cidade6304B2C0'
    )
  })

  it('is able to generate codes without a specified amount', () => {
    expect(
      pix({
        key: '26385709906',
        city: 'Cidade',
        name: 'FULANO DE TAL'
      })
    ).to.equal(
      '00020101021126330014br.gov.bcb.pix0111263857099065204000053039865802BR5913FULANO DE TAL6006Cidade63047AA0'
    )
  })

  it('generates valid codes for email keys', () => {
    expect(
      pix({
        key: 'fulano.de.tal@gmail.com',
        city: 'Cidade',
        name: 'FULANO DE TAL'
      })
    ).to.equal(
      '00020101021126450014br.gov.bcb.pix0123fulano.de.tal@gmail.com5204000053039865802BR5913FULANO DE TAL6006Cidade63044FA8'
    )
  })
  it('generates valid codes for random keys', () => {
    expect(
      pix({
        key: '4b7b4eb3-d426-48f1-8ecf-998bda62c0a1',
        city: 'Cidade',
        name: 'FULANO DE TAL'
      })
    ).to.equal(
      '00020101021126580014br.gov.bcb.pix01364b7b4eb3-d426-48f1-8ecf-998bda62c0a15204000053039865802BR5913FULANO DE TAL6006Cidade63042D6E'
    )
  })
  it('generates valid codes for phone keys', () => {
    expect(
      pix({
        key: '+5568375779606',
        city: 'Cidade',
        name: 'FULANO DE TAL'
      })
    ).to.equal(
      '00020101021126360014br.gov.bcb.pix0114+55683757796065204000053039865802BR5913FULANO DE TAL6006Cidade63045035'
    )
  })
  it('generates valid codes for cnpj keys', () => {
    expect(
      pix({
        key: '20687705000136',
        city: 'Cidade',
        name: 'FULANO DE TAL'
      })
    ).to.equal(
      '00020101021126360014br.gov.bcb.pix0114206877050001365204000053039865802BR5913FULANO DE TAL6006Cidade63043E7B'
    )
  })
})
