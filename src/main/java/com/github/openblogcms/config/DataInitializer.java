package com.github.openblogcms.config;

import com.github.openblogcms.model.Role;
import com.github.openblogcms.model.User;
import com.github.openblogcms.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;

    public DataInitializer(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            User admin = new User("admin", "admin123", Role.ADMIN);
            userRepository.save(admin);

            System.out.println("---------------------------------------------");
            System.out.println(" AUTOMATYCZNIE UTWORZONO ADMINA:");
            System.out.println(" Login: admin");
            System.out.println(" Has2o: admin123");
            System.out.println(" Rola:  " + admin.getRole() + " (ADMIN)");
            System.out.println("---------------------------------------------");
        }
    }
}

