package com.github.openblogcms.controller;

import com.github.openblogcms.model.ThemeConfig;
import com.github.openblogcms.repository.ThemeRepository;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/theme")
public class ThemeApiController {

    private final ThemeRepository themeRepository;

    public ThemeApiController(ThemeRepository themeRepository) {
        this.themeRepository = themeRepository;
    }


    @GetMapping // GET - Pobierz aktualny motyw
    public ThemeConfig getTheme() {
        /* Próbujemy znaleźć pierwszy rekord (ID=1).
         Jeśli baza jest pusta, zwracamy domyślne ustawienia (ale jeszcze ich nie zapisujemy) */
        return themeRepository.findAll().stream()
                .findFirst()
                .orElse(ThemeConfig.defaults());
    }


    @PostMapping // POST - Zapisz/Zaktualizuj motyw
    public ThemeConfig updateTheme(@RequestBody ThemeConfig newConfig) {
        // Sprawdzamy, czy w bazie już coś jest
        ThemeConfig existing = themeRepository.findAll().stream()
                .findFirst()
                .orElse(new ThemeConfig()); // Jak nie ma, tworzymy nowy obiekt

        // Aktualizujemy pola
        existing.setColorPrimary(newConfig.getColorPrimary());
        existing.setColorHeaderBg(newConfig.getColorHeaderBg());
        existing.setColorAsideBg(newConfig.getColorAsideBg());
        existing.setColorMainBg(newConfig.getColorMainBg());
        existing.setColorSurface(newConfig.getColorSurface());
        existing.setColorBodyBg(newConfig.getColorBodyBg());
        existing.setColorText(newConfig.getColorText());

        return themeRepository.save(existing);
    }
}