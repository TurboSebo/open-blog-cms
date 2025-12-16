package com.github.openblogcms.service;

import com.github.openblogcms.model.Config;
import com.github.openblogcms.repository.ConfigRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ConfigService {

    private final ConfigRepository configRepository;

    public static final String KEY_SITE_TITLE = "site.title";
    public static final String KEY_SITE_ABOUT_AUTHOR = "site.aboutAuthor";
    public static final String KEY_PAGE_ABOUT = "page.about";
    public static final String KEY_SITE_TITLE_ALIGN = "site.titleAlign"; // left, center, right

    public ConfigService(ConfigRepository configRepository) {
        this.configRepository = configRepository;
    }

    public String getValue(String key, String defaultValue) {
        Optional<Config> cfg = configRepository.findByKey(key);
        return cfg.map(Config::getValue).orElse(defaultValue);
    }

    public void setValue(String key, String value) {
        Config cfg = configRepository.findByKey(key).orElseGet(Config::new);
        cfg.setKey(key);
        cfg.setValue(value);
        configRepository.save(cfg);
    }
}
