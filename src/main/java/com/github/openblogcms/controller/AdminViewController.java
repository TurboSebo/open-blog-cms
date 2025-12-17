package com.github.openblogcms.controller;

import com.github.openblogcms.model.Post;
import com.github.openblogcms.model.Role;
import com.github.openblogcms.model.User;
import com.github.openblogcms.repository.PostRepository;
import com.github.openblogcms.service.ConfigService;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class AdminViewController {

    private final PostRepository postRepository;
    private final ConfigService configService;

    public AdminViewController(PostRepository postRepository, ConfigService configService) {
        this.postRepository = postRepository;
        this.configService = configService;
    }

    private boolean isAdmin(HttpSession session) {
        Object userObj = session.getAttribute("currentUser");
        Object roleObj = session.getAttribute("currentRole");
        return (userObj instanceof User) && (roleObj instanceof Integer) && ((Integer) roleObj) >= Role.ADMIN;
    }

    @GetMapping("/admin")
    public String dashboard(HttpSession session, Model model) {
        if (!isAdmin(session)) {
            return "redirect:/login";
        }
        User user = (User) session.getAttribute("currentUser");
        Object roleObj = session.getAttribute("currentRole");

        model.addAttribute("currentUser", user);
        model.addAttribute("currentRole", roleObj);
        return "admin/dashboard";
    }

    @GetMapping("/admin/add-post")
    public String addPostPage(HttpSession session, Model model) {
        if (!isAdmin(session)) {
            return "redirect:/login";
        }
        User user = (User) session.getAttribute("currentUser");
        Object roleObj = session.getAttribute("currentRole");

        model.addAttribute("currentUser", user);
        model.addAttribute("currentRole", roleObj);
        return "admin/addpost";
    }

    @GetMapping("/admin/edit-post/{id}")
    public String editPostPage(@PathVariable Long id, HttpSession session, Model model) {
        if (!isAdmin(session)) {
            return "redirect:/login";
        }
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post nie znaleziony"));

        User user = (User) session.getAttribute("currentUser");
        Object roleObj = session.getAttribute("currentRole");

        model.addAttribute("currentUser", user);
        model.addAttribute("currentRole", roleObj);
        model.addAttribute("post", post);
        return "admin/editpost";
    }

    @GetMapping("/admin/settings")
    public String settingsPage(HttpSession session, Model model) {
        if (!isAdmin(session)) {
            return "redirect:/login";
        }
        User user = (User) session.getAttribute("currentUser");
        Object roleObj = session.getAttribute("currentRole");

        // LayoutAttributesAdvice dostarcza: siteTitle, aboutAuthor, aboutContent, siteTitleAlign,
        // siteTitleColor, siteTitleSize, authorAvatar
        model.addAttribute("currentUser", user);
        model.addAttribute("currentRole", roleObj);
        return "admin/settings";
    }

    @PostMapping("/admin/settings")
    public String saveSettings(@RequestParam String siteTitle,
                               @RequestParam(required = false) String titleAlign,
                               @RequestParam(required = false) String aboutAuthor,
                               @RequestParam(required = false) String aboutContent,
                               @RequestParam(required = false) String siteTitleColor,
                               @RequestParam(required = false) String siteTitleSize,
                               @RequestParam(required = false) String authorAvatar,
                               HttpSession session,
                               Model model) {
        if (!isAdmin(session)) {
            return "redirect:/login";
        }

        configService.setValue(ConfigService.KEY_SITE_TITLE, siteTitle);
        configService.setValue(ConfigService.KEY_SITE_ABOUT_AUTHOR, aboutAuthor != null ? aboutAuthor : "");
        configService.setValue(ConfigService.KEY_PAGE_ABOUT, aboutContent != null ? aboutContent : "");
        configService.setValue(ConfigService.KEY_SITE_TITLE_ALIGN,
                (titleAlign != null && !titleAlign.isBlank()) ? titleAlign : "left");
        configService.setValue(ConfigService.KEY_SITE_TITLE_COLOR,
                (siteTitleColor != null && !siteTitleColor.isBlank()) ? siteTitleColor : "#ffffff");
        configService.setValue(ConfigService.KEY_SITE_TITLE_SIZE,
            (siteTitleSize != null && !siteTitleSize.isBlank()) ? siteTitleSize : "32");
        configService.setValue(ConfigService.KEY_SITE_AUTHOR_AVATAR,
                authorAvatar != null ? authorAvatar : "");

        model.addAttribute("successMessage", "Zapisano ustawienia.");
        return settingsPage(session, model);
    }
}
