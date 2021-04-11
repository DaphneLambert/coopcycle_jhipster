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
 * A Compte.
 */
@Entity
@Table(name = "compte")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Compte implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @NotNull
    @Column(name = "surname", nullable = false)
    private String surname;

    @Min(value = 0)
    @Max(value = 120)
    @Column(name = "age")
    private Integer age;

    @NotNull
    @Column(name = "adress", nullable = false)
    private String adress;

    @OneToMany(mappedBy = "compte")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "contents", "compte", "restaurant" }, allowSetters = true)
    private Set<Panier> carts = new HashSet<>();

    @ManyToOne
    private Roles roles;

    @JsonIgnoreProperties(value = { "owned", "products", "orders", "carts", "cooperative" }, allowSetters = true)
    @OneToOne(mappedBy = "owned")
    private Restaurant owns;

    @ManyToOne
    @JsonIgnoreProperties(value = { "possessions", "members" }, allowSetters = true)
    private Cooperative cooperative;

    @ManyToMany(mappedBy = "agents")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "agents" }, allowSetters = true)
    private Set<SystemePaiement> operations = new HashSet<>();

    @ManyToMany(mappedBy = "agents")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "order", "agents", "restaurant" }, allowSetters = true)
    private Set<Course> courses = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Compte id(String id) {
        this.id = id;
        return this;
    }

    public String getName() {
        return this.name;
    }

    public Compte name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSurname() {
        return this.surname;
    }

    public Compte surname(String surname) {
        this.surname = surname;
        return this;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public Integer getAge() {
        return this.age;
    }

    public Compte age(Integer age) {
        this.age = age;
        return this;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getAdress() {
        return this.adress;
    }

    public Compte adress(String adress) {
        this.adress = adress;
        return this;
    }

    public void setAdress(String adress) {
        this.adress = adress;
    }

    public Set<Panier> getCarts() {
        return this.carts;
    }

    public Compte carts(Set<Panier> paniers) {
        this.setCarts(paniers);
        return this;
    }

    public Compte addCarts(Panier panier) {
        this.carts.add(panier);
        panier.setCompte(this);
        return this;
    }

    public Compte removeCarts(Panier panier) {
        this.carts.remove(panier);
        panier.setCompte(null);
        return this;
    }

    public void setCarts(Set<Panier> paniers) {
        if (this.carts != null) {
            this.carts.forEach(i -> i.setCompte(null));
        }
        if (paniers != null) {
            paniers.forEach(i -> i.setCompte(this));
        }
        this.carts = paniers;
    }

    public Roles getRoles() {
        return this.roles;
    }

    public Compte roles(Roles roles) {
        this.setRoles(roles);
        return this;
    }

    public void setRoles(Roles roles) {
        this.roles = roles;
    }

    public Restaurant getOwns() {
        return this.owns;
    }

    public Compte owns(Restaurant restaurant) {
        this.setOwns(restaurant);
        return this;
    }

    public void setOwns(Restaurant restaurant) {
        if (this.owns != null) {
            this.owns.setOwned(null);
        }
        if (owns != null) {
            owns.setOwned(this);
        }
        this.owns = restaurant;
    }

    public Cooperative getCooperative() {
        return this.cooperative;
    }

    public Compte cooperative(Cooperative cooperative) {
        this.setCooperative(cooperative);
        return this;
    }

    public void setCooperative(Cooperative cooperative) {
        this.cooperative = cooperative;
    }

    public Set<SystemePaiement> getOperations() {
        return this.operations;
    }

    public Compte operations(Set<SystemePaiement> systemePaiements) {
        this.setOperations(systemePaiements);
        return this;
    }

    public Compte addOperations(SystemePaiement systemePaiement) {
        this.operations.add(systemePaiement);
        systemePaiement.getAgents().add(this);
        return this;
    }

    public Compte removeOperations(SystemePaiement systemePaiement) {
        this.operations.remove(systemePaiement);
        systemePaiement.getAgents().remove(this);
        return this;
    }

    public void setOperations(Set<SystemePaiement> systemePaiements) {
        if (this.operations != null) {
            this.operations.forEach(i -> i.removeAgents(this));
        }
        if (systemePaiements != null) {
            systemePaiements.forEach(i -> i.addAgents(this));
        }
        this.operations = systemePaiements;
    }

    public Set<Course> getCourses() {
        return this.courses;
    }

    public Compte courses(Set<Course> courses) {
        this.setCourses(courses);
        return this;
    }

    public Compte addCourses(Course course) {
        this.courses.add(course);
        course.getAgents().add(this);
        return this;
    }

    public Compte removeCourses(Course course) {
        this.courses.remove(course);
        course.getAgents().remove(this);
        return this;
    }

    public void setCourses(Set<Course> courses) {
        if (this.courses != null) {
            this.courses.forEach(i -> i.removeAgents(this));
        }
        if (courses != null) {
            courses.forEach(i -> i.addAgents(this));
        }
        this.courses = courses;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Compte)) {
            return false;
        }
        return id != null && id.equals(((Compte) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Compte{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", surname='" + getSurname() + "'" +
            ", age=" + getAge() +
            ", adress='" + getAdress() + "'" +
            "}";
    }
}
