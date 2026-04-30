---
layout: default
title: Blog
description: Notes, essays, and updates.
---

<section class="section-card">
  <h3>Recent Posts</h3>
  <div class="post-preview-grid">
  {% for post in site.posts limit: 3 %}
    {% assign preview_image = post.preview_image | default: post.image | default: post.cover | default: post.thumbnail %}
    <article class="post-preview-card{% unless preview_image %} no-image{% endunless %}">
      {% if preview_image %}
        <a class="post-preview-media" href="{{ post.url | relative_url }}">
          <img src="{{ preview_image | relative_url }}" alt="Preview image for {{ post.title }}" class="post-preview-image" />
        </a>
      {% endif %}
      <div class="post-preview-body">
        <p class="post-preview-date">{{ post.date | date: "%B %d, %Y" }}</p>
        <h4 class="post-preview-title">
          <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
        </h4>
        <p class="post-preview-excerpt">
          {% if post.excerpt %}
            {{ post.excerpt | strip_html | strip_newlines | truncate: 180 }}
          {% else %}
            {{ post.content | strip_html | strip_newlines | truncate: 180 }}
          {% endif %}
        </p>
      </div>
    </article>
  {% endfor %}
  </div>
</section>

<section class="section-card">
  <h3>Archive of My Blog Posts</h3>
  <ul class="archive-list">
  {% for post in site.posts %}
    <li>
      <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
      <small>{{ post.date | date: "%B %d, %Y" }}</small>
    </li>
  {% endfor %}
  </ul>
</section>
