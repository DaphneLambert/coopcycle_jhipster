package fr.polytech.info4.repository;

import fr.polytech.info4.domain.Roles;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Roles entity.
 */
@SuppressWarnings("unused")
@Repository
public interface RolesRepository extends JpaRepository<Roles, Long> {}
