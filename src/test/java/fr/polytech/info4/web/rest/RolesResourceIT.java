package fr.polytech.info4.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import fr.polytech.info4.IntegrationTest;
import fr.polytech.info4.domain.Roles;
import fr.polytech.info4.repository.RolesRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link RolesResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class RolesResourceIT {

    private static final String DEFAULT_ROLE = "AAAAAAAAAA";
    private static final String UPDATED_ROLE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/roles";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private RolesRepository rolesRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restRolesMockMvc;

    private Roles roles;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Roles createEntity(EntityManager em) {
        Roles roles = new Roles().role(DEFAULT_ROLE);
        return roles;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Roles createUpdatedEntity(EntityManager em) {
        Roles roles = new Roles().role(UPDATED_ROLE);
        return roles;
    }

    @BeforeEach
    public void initTest() {
        roles = createEntity(em);
    }

    @Test
    @Transactional
    void createRoles() throws Exception {
        int databaseSizeBeforeCreate = rolesRepository.findAll().size();
        // Create the Roles
        restRolesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(roles)))
            .andExpect(status().isCreated());

        // Validate the Roles in the database
        List<Roles> rolesList = rolesRepository.findAll();
        assertThat(rolesList).hasSize(databaseSizeBeforeCreate + 1);
        Roles testRoles = rolesList.get(rolesList.size() - 1);
        assertThat(testRoles.getRole()).isEqualTo(DEFAULT_ROLE);
    }

    @Test
    @Transactional
    void createRolesWithExistingId() throws Exception {
        // Create the Roles with an existing ID
        roles.setId(1L);

        int databaseSizeBeforeCreate = rolesRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restRolesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(roles)))
            .andExpect(status().isBadRequest());

        // Validate the Roles in the database
        List<Roles> rolesList = rolesRepository.findAll();
        assertThat(rolesList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkRoleIsRequired() throws Exception {
        int databaseSizeBeforeTest = rolesRepository.findAll().size();
        // set the field null
        roles.setRole(null);

        // Create the Roles, which fails.

        restRolesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(roles)))
            .andExpect(status().isBadRequest());

        List<Roles> rolesList = rolesRepository.findAll();
        assertThat(rolesList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllRoles() throws Exception {
        // Initialize the database
        rolesRepository.saveAndFlush(roles);

        // Get all the rolesList
        restRolesMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(roles.getId().intValue())))
            .andExpect(jsonPath("$.[*].role").value(hasItem(DEFAULT_ROLE)));
    }

    @Test
    @Transactional
    void getRoles() throws Exception {
        // Initialize the database
        rolesRepository.saveAndFlush(roles);

        // Get the roles
        restRolesMockMvc
            .perform(get(ENTITY_API_URL_ID, roles.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(roles.getId().intValue()))
            .andExpect(jsonPath("$.role").value(DEFAULT_ROLE));
    }

    @Test
    @Transactional
    void getNonExistingRoles() throws Exception {
        // Get the roles
        restRolesMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewRoles() throws Exception {
        // Initialize the database
        rolesRepository.saveAndFlush(roles);

        int databaseSizeBeforeUpdate = rolesRepository.findAll().size();

        // Update the roles
        Roles updatedRoles = rolesRepository.findById(roles.getId()).get();
        // Disconnect from session so that the updates on updatedRoles are not directly saved in db
        em.detach(updatedRoles);
        updatedRoles.role(UPDATED_ROLE);

        restRolesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedRoles.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedRoles))
            )
            .andExpect(status().isOk());

        // Validate the Roles in the database
        List<Roles> rolesList = rolesRepository.findAll();
        assertThat(rolesList).hasSize(databaseSizeBeforeUpdate);
        Roles testRoles = rolesList.get(rolesList.size() - 1);
        assertThat(testRoles.getRole()).isEqualTo(UPDATED_ROLE);
    }

    @Test
    @Transactional
    void putNonExistingRoles() throws Exception {
        int databaseSizeBeforeUpdate = rolesRepository.findAll().size();
        roles.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRolesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, roles.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(roles))
            )
            .andExpect(status().isBadRequest());

        // Validate the Roles in the database
        List<Roles> rolesList = rolesRepository.findAll();
        assertThat(rolesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchRoles() throws Exception {
        int databaseSizeBeforeUpdate = rolesRepository.findAll().size();
        roles.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRolesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(roles))
            )
            .andExpect(status().isBadRequest());

        // Validate the Roles in the database
        List<Roles> rolesList = rolesRepository.findAll();
        assertThat(rolesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamRoles() throws Exception {
        int databaseSizeBeforeUpdate = rolesRepository.findAll().size();
        roles.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRolesMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(roles)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Roles in the database
        List<Roles> rolesList = rolesRepository.findAll();
        assertThat(rolesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateRolesWithPatch() throws Exception {
        // Initialize the database
        rolesRepository.saveAndFlush(roles);

        int databaseSizeBeforeUpdate = rolesRepository.findAll().size();

        // Update the roles using partial update
        Roles partialUpdatedRoles = new Roles();
        partialUpdatedRoles.setId(roles.getId());

        partialUpdatedRoles.role(UPDATED_ROLE);

        restRolesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRoles.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedRoles))
            )
            .andExpect(status().isOk());

        // Validate the Roles in the database
        List<Roles> rolesList = rolesRepository.findAll();
        assertThat(rolesList).hasSize(databaseSizeBeforeUpdate);
        Roles testRoles = rolesList.get(rolesList.size() - 1);
        assertThat(testRoles.getRole()).isEqualTo(UPDATED_ROLE);
    }

    @Test
    @Transactional
    void fullUpdateRolesWithPatch() throws Exception {
        // Initialize the database
        rolesRepository.saveAndFlush(roles);

        int databaseSizeBeforeUpdate = rolesRepository.findAll().size();

        // Update the roles using partial update
        Roles partialUpdatedRoles = new Roles();
        partialUpdatedRoles.setId(roles.getId());

        partialUpdatedRoles.role(UPDATED_ROLE);

        restRolesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRoles.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedRoles))
            )
            .andExpect(status().isOk());

        // Validate the Roles in the database
        List<Roles> rolesList = rolesRepository.findAll();
        assertThat(rolesList).hasSize(databaseSizeBeforeUpdate);
        Roles testRoles = rolesList.get(rolesList.size() - 1);
        assertThat(testRoles.getRole()).isEqualTo(UPDATED_ROLE);
    }

    @Test
    @Transactional
    void patchNonExistingRoles() throws Exception {
        int databaseSizeBeforeUpdate = rolesRepository.findAll().size();
        roles.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRolesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, roles.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(roles))
            )
            .andExpect(status().isBadRequest());

        // Validate the Roles in the database
        List<Roles> rolesList = rolesRepository.findAll();
        assertThat(rolesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchRoles() throws Exception {
        int databaseSizeBeforeUpdate = rolesRepository.findAll().size();
        roles.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRolesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(roles))
            )
            .andExpect(status().isBadRequest());

        // Validate the Roles in the database
        List<Roles> rolesList = rolesRepository.findAll();
        assertThat(rolesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamRoles() throws Exception {
        int databaseSizeBeforeUpdate = rolesRepository.findAll().size();
        roles.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRolesMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(roles)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Roles in the database
        List<Roles> rolesList = rolesRepository.findAll();
        assertThat(rolesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteRoles() throws Exception {
        // Initialize the database
        rolesRepository.saveAndFlush(roles);

        int databaseSizeBeforeDelete = rolesRepository.findAll().size();

        // Delete the roles
        restRolesMockMvc
            .perform(delete(ENTITY_API_URL_ID, roles.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Roles> rolesList = rolesRepository.findAll();
        assertThat(rolesList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
