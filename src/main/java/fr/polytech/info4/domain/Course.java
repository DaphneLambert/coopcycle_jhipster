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
 * A Course.
 */
@Entity
@Table(name = "course")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Course implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @NotNull
    @Column(name = "time_required", nullable = false)
    private Integer timeRequired;

    @JsonIgnoreProperties(value = { "contents", "compte", "restaurant" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private Panier order;

    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JoinTable(
        name = "rel_course__agents",
        joinColumns = @JoinColumn(name = "course_id"),
        inverseJoinColumns = @JoinColumn(name = "agents_id")
    )
    @JsonIgnoreProperties(value = { "carts", "roles", "owns", "cooperative", "operations", "courses" }, allowSetters = true)
    private Set<Compte> agents = new HashSet<>();

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

    public Course id(String id) {
        this.id = id;
        return this;
    }

    public Integer getTimeRequired() {
        return this.timeRequired;
    }

    public Course timeRequired(Integer timeRequired) {
        this.timeRequired = timeRequired;
        return this;
    }

    public void setTimeRequired(Integer timeRequired) {
        this.timeRequired = timeRequired;
    }

    public Panier getOrder() {
        return this.order;
    }

    public Course order(Panier panier) {
        this.setOrder(panier);
        return this;
    }

    public void setOrder(Panier panier) {
        this.order = panier;
    }

    public Set<Compte> getAgents() {
        return this.agents;
    }

    public Course agents(Set<Compte> comptes) {
        this.setAgents(comptes);
        return this;
    }

    public Course addAgents(Compte compte) {
        this.agents.add(compte);
        compte.getCourses().add(this);
        return this;
    }

    public Course removeAgents(Compte compte) {
        this.agents.remove(compte);
        compte.getCourses().remove(this);
        return this;
    }

    public void setAgents(Set<Compte> comptes) {
        this.agents = comptes;
    }

    public Restaurant getRestaurant() {
        return this.restaurant;
    }

    public Course restaurant(Restaurant restaurant) {
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
        if (!(o instanceof Course)) {
            return false;
        }
        return id != null && id.equals(((Course) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Course{" +
            "id=" + getId() +
            ", timeRequired=" + getTimeRequired() +
            "}";
    }
}
