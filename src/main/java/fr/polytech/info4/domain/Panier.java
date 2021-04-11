package fr.polytech.info4.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Panier.
 */
@Entity
@Table(name = "panier")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Panier implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @NotNull
    @Column(name = "nb_elements", nullable = false)
    private Integer nbElements;

    @NotNull
    @Column(name = "price", nullable = false)
    private Integer price;

    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JoinTable(
        name = "rel_panier__content",
        joinColumns = @JoinColumn(name = "panier_id"),
        inverseJoinColumns = @JoinColumn(name = "content_id")
    )
    @JsonIgnoreProperties(value = { "restaurant", "carts" }, allowSetters = true)
    private Set<Produit> contents = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "carts", "roles", "owns", "cooperative", "operations", "courses" }, allowSetters = true)
    private Compte compte;

    @ManyToOne
    @JsonIgnoreProperties(value = { "owned", "products", "orders", "carts", "cooperative" }, allowSetters = true)
    private Restaurant restaurant;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Panier id(String id) {
        this.id = id;
        return this;
    }

    public Integer getNbElements() {
        return this.nbElements;
    }

    public Panier nbElements(Integer nbElements) {
        this.nbElements = nbElements;
        return this;
    }

    public void setNbElements(Integer nbElements) {
        this.nbElements = nbElements;
    }

    public Integer getPrice() {
        return this.price;
    }

    public Panier price(Integer price) {
        this.price = price;
        return this;
    }

    public void setPrice(Integer price) {
        this.price = price;
    }

    public Set<Produit> getContents() {
        return this.contents;
    }

    public Panier contents(Set<Produit> produits) {
        this.setContents(produits);
        return this;
    }

    public Panier addContent(Produit produit) {
        this.contents.add(produit);
        produit.getCarts().add(this);
        return this;
    }

    public Panier removeContent(Produit produit) {
        this.contents.remove(produit);
        produit.getCarts().remove(this);
        return this;
    }

    public void setContents(Set<Produit> produits) {
        this.contents = produits;
    }

    public Compte getCompte() {
        return this.compte;
    }

    public Panier compte(Compte compte) {
        this.setCompte(compte);
        return this;
    }

    public void setCompte(Compte compte) {
        this.compte = compte;
    }

    public Restaurant getRestaurant() {
        return this.restaurant;
    }

    public Panier restaurant(Restaurant restaurant) {
        this.setRestaurant(restaurant);
        return this;
    }

    public void setRestaurant(Restaurant restaurant) {
        this.restaurant = restaurant;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Panier)) {
            return false;
        }
        return id != null && id.equals(((Panier) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Panier{" +
            "id=" + getId() +
            ", nbElements=" + getNbElements() +
            ", price=" + getPrice() +
            "}";
    }
}
