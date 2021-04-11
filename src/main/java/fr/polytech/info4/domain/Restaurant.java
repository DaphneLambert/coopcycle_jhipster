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
 * A Restaurant.
 */
@Entity
@Table(name = "restaurant")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Restaurant implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @NotNull
    @Column(name = "adress", nullable = false)
    private String adress;

    @JsonIgnoreProperties(value = { "carts", "roles", "owns", "cooperative", "operations", "courses" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private Compte owned;

    @OneToMany(mappedBy = "restaurant")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "restaurant", "carts" }, allowSetters = true)
    private Set<Produit> products = new HashSet<>();

    @OneToMany(mappedBy = "restaurant")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "order", "agents", "restaurant" }, allowSetters = true)
    private Set<Course> orders = new HashSet<>();

    @OneToMany(mappedBy = "restaurant")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "contents", "compte", "restaurant" }, allowSetters = true)
    private Set<Panier> carts = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "possessions", "members" }, allowSetters = true)
    private Cooperative cooperative;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Restaurant id(String id) {
        this.id = id;
        return this;
    }

    public String getName() {
        return this.name;
    }

    public Restaurant name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAdress() {
        return this.adress;
    }

    public Restaurant adress(String adress) {
        this.adress = adress;
        return this;
    }

    public void setAdress(String adress) {
        this.adress = adress;
    }

    public Compte getOwned() {
        return this.owned;
    }

    public Restaurant owned(Compte compte) {
        this.setOwned(compte);
        return this;
    }

    public void setOwned(Compte compte) {
        this.owned = compte;
    }

    public Set<Produit> getProducts() {
        return this.products;
    }

    public Restaurant products(Set<Produit> produits) {
        this.setProducts(produits);
        return this;
    }

    public Restaurant addProducts(Produit produit) {
        this.products.add(produit);
        produit.setRestaurant(this);
        return this;
    }

    public Restaurant removeProducts(Produit produit) {
        this.products.remove(produit);
        produit.setRestaurant(null);
        return this;
    }

    public void setProducts(Set<Produit> produits) {
        if (this.products != null) {
            this.products.forEach(i -> i.setRestaurant(null));
        }
        if (produits != null) {
            produits.forEach(i -> i.setRestaurant(this));
        }
        this.products = produits;
    }

    public Set<Course> getOrders() {
        return this.orders;
    }

    public Restaurant orders(Set<Course> courses) {
        this.setOrders(courses);
        return this;
    }

    public Restaurant addOrders(Course course) {
        this.orders.add(course);
        course.setRestaurant(this);
        return this;
    }

    public Restaurant removeOrders(Course course) {
        this.orders.remove(course);
        course.setRestaurant(null);
        return this;
    }

    public void setOrders(Set<Course> courses) {
        if (this.orders != null) {
            this.orders.forEach(i -> i.setRestaurant(null));
        }
        if (courses != null) {
            courses.forEach(i -> i.setRestaurant(this));
        }
        this.orders = courses;
    }

    public Set<Panier> getCarts() {
        return this.carts;
    }

    public Restaurant carts(Set<Panier> paniers) {
        this.setCarts(paniers);
        return this;
    }

    public Restaurant addCarts(Panier panier) {
        this.carts.add(panier);
        panier.setRestaurant(this);
        return this;
    }

    public Restaurant removeCarts(Panier panier) {
        this.carts.remove(panier);
        panier.setRestaurant(null);
        return this;
    }

    public void setCarts(Set<Panier> paniers) {
        if (this.carts != null) {
            this.carts.forEach(i -> i.setRestaurant(null));
        }
        if (paniers != null) {
            paniers.forEach(i -> i.setRestaurant(this));
        }
        this.carts = paniers;
    }

    public Cooperative getCooperative() {
        return this.cooperative;
    }

    public Restaurant cooperative(Cooperative cooperative) {
        this.setCooperative(cooperative);
        return this;
    }

    public void setCooperative(Cooperative cooperative) {
        this.cooperative = cooperative;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Restaurant)) {
            return false;
        }
        return id != null && id.equals(((Restaurant) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Restaurant{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", adress='" + getAdress() + "'" +
            "}";
    }
}
