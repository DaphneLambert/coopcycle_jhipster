package fr.polytech.info4.domain;

import static org.assertj.core.api.Assertions.assertThat;

import fr.polytech.info4.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class PanierTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Panier.class);
        Panier panier1 = new Panier();
        panier1.setId("id1");
        Panier panier2 = new Panier();
        panier2.setId(panier1.getId());
        assertThat(panier1).isEqualTo(panier2);
        panier2.setId("id2");
        assertThat(panier1).isNotEqualTo(panier2);
        panier1.setId(null);
        assertThat(panier1).isNotEqualTo(panier2);
    }
}
