package com.github.openblogcms.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "theme_settings")
public class ThemeConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Nazwy pól odpowiadają logicznie zmiennym w CSS
    private String colorPrimary;      // --c-primary
    private String colorHeaderBg;     // --c-header-bg
    private String colorAsideBg;      // --c-aside-bg
    private String colorMainBg;       // --c-main-bg
    private String colorSurface;      // --c-surface
    private String colorBodyBg;       // --c-body-bg
    private String colorText;         // --c-body-fg (tekst)

    // Metoda pomocnicza, żeby ustawić domyślne kolory, jeśli baza jest pusta
    public static ThemeConfig defaults() {
        ThemeConfig config = new ThemeConfig();
        config.setColorPrimary("#3b82f6");
        config.setColorHeaderBg("#1e293b");
        config.setColorAsideBg("#1e293b");
        config.setColorMainBg("transparent");
        config.setColorSurface("#1e293b");
        config.setColorBodyBg("#0f172a");
        config.setColorText("#e2e8f0");
        return config;
    }
}