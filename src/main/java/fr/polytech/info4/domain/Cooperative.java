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
 * A Cooperative.
 */
@Entity
@Table(name = "cooperative")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Cooperative implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @OneToMany(mappedBy = "cooperative")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "owned", "products", "orders", "carts", "cooperative" }, allowSetters = true)
    private Set<Restaurant> possessions = new HashSet<>();

    @OneToMany(mappedBy = "cooperative")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "carts", "roles", "owns", "cooperative", "operations", "courses" }, allowSetters = true)
    private Set<Compte> members = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Cooperative id(String id) {
        this.id = id;
        return this;
    }

    public String getName() {
        return this.name;
    }

    public Cooperative name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<Restaurant> getPossessions() {
        return this.possessions;
    }

    public Cooperative possessions(Set<Restaurant> restaurants) {
        this.setPossessions(restaurants);
        return this;
    }

    public Cooperative addPossessions(Restaurant restaurant) {
        this.possessions.add(restaurant);
        restaurant.setCooperative(this);
        return this;
    }

    public Cooperative removePossessions(Restaurant restaurant) {
        this.possessions.remove(restaurant);
        restaurant.setCooperative(null);
        return this;
    }

    public void setPossessions(Set<Restaurant> restaurants) {
        if (this.possessions != null) {
            this.possessions.forEach(i -> i.setCooperative(null));
        }
        if (restaurants != null) {
            restaurants.forEach(i -> i.setCooperative(this));
        }
        this.possessions = restaurants;
    }

    public Set<Compte> getMembers() {
        return this.members;
    }

    public Cooperative members(Set<Compte> comptes) {
        this.setMembers(comptes);
        return this;
    }

    public Cooperative addMembers(Compte compte) {
        this.members.add(compte);
        compte.setCooperative(this);
        return this;
    }

    public Cooperative removeMembers(Compte compte) {
        this.members.remove(compte);
        compte.setCooperative(null);
        return this;
    }

    public void setMembers(Set<Compte> comptes) {
        if (this.members != null) {
            this.members.forEach(i -> i.setCooperative(null));
        }
        if (comptes != null) {
            comptes.forEach(i -> i.setCooperative(this));
        }
        this.members = comptes;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Cooperative)) {
            return false;
        }
        return id != null && id.equals(((Cooperative) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Cooperative{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            "}";
    }
}
