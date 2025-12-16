package com.github.openblogcms.config;

import com.github.openblogcms.model.Config;
import com.github.openblogcms.model.Role;
import com.github.openblogcms.model.User;
import com.github.openblogcms.repository.ConfigRepository;
import com.github.openblogcms.repository.UserRepository;
import com.github.openblogcms.service.ConfigService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ConfigRepository configRepository;

    public DataInitializer(UserRepository userRepository, ConfigRepository configRepository) {
        this.userRepository = userRepository;
        this.configRepository = configRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        initDefaultConfig();

        if (userRepository.count() == 0) {
            User admin = new User("admin", "admin123", Role.ADMIN);
            userRepository.save(admin);

            System.out.println("---------------------------------------------");
            System.out.println(" AUTOMATYCZNIE UTWORZONO ADMINA:");
            System.out.println(" Login: admin");
            System.out.println(" Hasło: admin123");
            System.out.println(" Rola:  " + admin.getRole() + " (ADMIN)");
            System.out.println("---------------------------------------------");
        }
    }

    private void initDefaultConfig() {
        // Domyślny tytuł strony
        configRepository.findByKey(ConfigService.KEY_SITE_TITLE)
                .orElseGet(() -> {
                    Config c = new Config();
                    c.setKey(ConfigService.KEY_SITE_TITLE);
                    c.setValue("Open Blog CMS");
                    return configRepository.save(c);
                });

        // Domyślna treść sekcji "O autorze" (sidebar)
        configRepository.findByKey(ConfigService.KEY_SITE_ABOUT_AUTHOR)
                .orElseGet(() -> {
                    Config c = new Config();
                    c.setKey(ConfigService.KEY_SITE_ABOUT_AUTHOR);
                    c.setValue("To jest prosty blog zbudowany na Spring Boot i czystym JavaScript.");
                    return configRepository.save(c);
                });

        // Domyślna treść strony "O blogu"
        configRepository.findByKey(ConfigService.KEY_PAGE_ABOUT)
                .orElseGet(() -> {
                    Config c = new Config();
                    c.setKey(ConfigService.KEY_PAGE_ABOUT);
                    c.setValue("<p>To jest prosty blog, na którym możesz publikować swoje przemyślenia.</p>");
                    return configRepository.save(c);
                });

        // Domyślne wyrównanie tytułu (left)
        configRepository.findByKey(ConfigService.KEY_SITE_TITLE_ALIGN)
                .orElseGet(() -> {
                    Config c = new Config();
                    c.setKey(ConfigService.KEY_SITE_TITLE_ALIGN);
                    c.setValue("left");
                    return configRepository.save(c);
                });
    }
}
