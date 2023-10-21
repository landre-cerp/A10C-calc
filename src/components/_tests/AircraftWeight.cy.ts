import AircraftWeight from '../AircraftWeight.vue'

describe('<AircraftWeight />', () => {

  it('renders', () => {

    context('with default options', () => {
      // see: https://on.cypress.io/mounting-vue
      const emptyWeight = 25629;
      const fuelWeight = 5000;
      const weaponsWeight = 2950;

      cy.mount(AircraftWeight, {
        props: {
          maxTakeOffWeight: 46600,
          emptyWeight: emptyWeight,
          weaponsWeight: weaponsWeight,
          fuelWeight: fuelWeight,
        },
      })
      const expectedEWS = ` ${emptyWeight} lbs`
      cy.get('div#emptyWeight').should('have.text', expectedEWS)

      const expectedWPS = `${weaponsWeight} WP`
      cy.get('div#weaponsWeight').should('have.text', expectedWPS)

      const expectedFWS = `${fuelWeight} lbs`
      cy.get('div#fuelWeight').should('have.text', expectedFWS)

    })

    context('with No Weapons : 0 Lbs', () => {

      const emptyWeight = 25629;
      const fuelWeight = 5000;


      cy.mount(AircraftWeight, {
        props: {
          maxTakeOffWeight: 46600,
          emptyWeight: emptyWeight,
          weaponsWeight: 0,
          fuelWeight: fuelWeight,
        },
      })

      const expectedEWS = ` ${emptyWeight} lbs`
      cy.get('div#emptyWeight').should('have.text', expectedEWS)

      cy.get('div#weaponsWeight').should('not.exist')
      const expectedFWS = `${fuelWeight} lbs`
      cy.get('div#fuelWeight').should('have.text', expectedFWS)

    })

    context('with No Fuel : 0 Lbs', () => {

      const emptyWeight = 25629

      cy.mount(AircraftWeight, {
        props: {
          maxTakeOffWeight: 46600,
          emptyWeight: emptyWeight,
          weaponsWeight: 0,
          fuelWeight: 0,
        },
      })

      const expectedEWS = ` ${emptyWeight} lbs`
      cy.get('div#emptyWeight').should('have.text', expectedEWS)

      cy.get('div#weaponsWeight').should('not.exist')
      cy.get('div#fuelWeight').should('not.exist')

    })
  })

})

