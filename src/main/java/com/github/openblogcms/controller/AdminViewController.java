package com.github.openblogcms.controller;

import com.github.openblogcms.model.Post;
import com.github.openblogcms.model.Role;
import com.github.openblogcms.model.User;
import com.github.openblogcms.repository.PostRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class AdminViewController {

    private final PostRepository postRepository;

    public AdminViewController(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

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

    @GetMapping("/admin/add-post")
    public String addPostPage(HttpSession session, Model model) {
        Object userObj = session.getAttribute("currentUser");
        Object roleObj = session.getAttribute("currentRole");

        if (!(userObj instanceof User) || !(roleObj instanceof Integer) || ((Integer) roleObj) < Role.ADMIN) {
            return "redirect:/login";
        }

        User user = (User) userObj;
        model.addAttribute("currentUser", user);
        model.addAttribute("currentRole", roleObj);
        return "admin/addpost";
    }

    @GetMapping("/admin/edit-post/{id}")
    public String editPostPage(@PathVariable Long id, HttpSession session, Model model) {
        Object userObj = session.getAttribute("currentUser");
        Object roleObj = session.getAttribute("currentRole");

        if (!(userObj instanceof User) || !(roleObj instanceof Integer) || ((Integer) roleObj) < Role.ADMIN) {
            return "redirect:/login";
        }

        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post nie znaleziony"));

        User user = (User) userObj;
        model.addAttribute("currentUser", user);
        model.addAttribute("currentRole", roleObj);
        model.addAttribute("post", post);
        return "admin/editpost";
    }
}
