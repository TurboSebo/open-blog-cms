package com.github.openblogcms.controller;

import com.github.openblogcms.model.Role;
import com.github.openblogcms.model.User;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AdminViewController {

    @GetMapping("/admin")
    public String dashboard(HttpSession session, Model model) {
        Object userObj = session.getAttribute("currentUser");
        Object roleObj = session.getAttribute("currentRole");

        if (!(userObj instanceof User) || !(roleObj instanceof Integer) || ((Integer) roleObj) < Role.ADMIN) {
            return "redirect:/login";
        }

        User user = (User) userObj;
        model.addAttribute("currentUser", user);
        model.addAttribute("currentRole", roleObj);
        return "admin/dashboard";
    }
}
