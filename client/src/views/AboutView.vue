<template>
  <div class="about-container">
    <div class="hero-section">
      <h1>{{ title }}</h1>
      <p class="subtitle">{{ subtitle }}</p>
    </div>

    <section class="mission-section">
      <h2>Our Mission</h2>
      <p>{{ mission }}</p>
    </section>

    <section class="team-section">
      <h2>Meet Our Team</h2>
      <div class="team-grid">
        <div v-for="member in teamMembers" :key="member.id" class="team-member">
          <img :src="member.avatar" :alt="member.name" loading="lazy" />
          <h3>{{ member.name }}</h3>
          <p class="role">{{ member.role }}</p>
          <p class="bio">{{ member.bio }}</p>
        </div>
      </div>
    </section>

    <section class="values-section">
      <h2>Our Values</h2>
      <div class="values-grid">
        <div v-for="value in companyValues" :key="value.id" class="value-card">
          <i :class="value.icon"></i>
          <h3>{{ value.title }}</h3>
          <p>{{ value.description }}</p>
        </div>
      </div>
    </section>

    <section class="contact-section">
      <h2>Get in Touch</h2>
      <div class="contact-info">
        <p>{{ contactInfo.address }}</p>
        <p>{{ contactInfo.email }}</p>
        <p>{{ contactInfo.phone }}</p>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

// Interfaces for type safety
interface TeamMember {
  id: number
  name: string
  role: string
  bio: string
  avatar: string
}

interface CompanyValue {
  id: number
  title: string
  description: string
  icon: string
}

interface ContactInfo {
  address: string
  email: string
  phone: string
}

export default defineComponent({
  name: 'AboutView',
  setup() {
    const title = 'About Us'
    const subtitle = 'Building the future, one innovation at a time'
    const mission =
      'Our mission is to create innovative solutions that empower businesses and individuals to achieve their full potential in the digital age.'

    const teamMembers: TeamMember[] = [
      {
        id: 1,
        name: 'Sarah Johnson',
        role: 'CEO & Founder',
        bio: 'With over 15 years of experience in tech leadership, Sarah drives our vision forward.',
        avatar: '/images/team/sarah.jpg',
      },
      {
        id: 2,
        name: 'Michael Chen',
        role: 'CTO',
        bio: 'Michael brings extensive expertise in scalable architecture and emerging technologies.',
        avatar: '/images/team/michael.jpg',
      },
      {
        id: 3,
        name: 'Emma Rodriguez',
        role: 'Head of Design',
        bio: 'Emma leads our design team with a passion for creating beautiful, intuitive experiences.',
        avatar: '/images/team/emma.jpg',
      },
    ]

    const companyValues: CompanyValue[] = [
      {
        id: 1,
        title: 'Innovation',
        description: 'We push boundaries and embrace new technologies to solve complex challenges.',
        icon: 'fas fa-lightbulb',
      },
      {
        id: 2,
        title: 'Integrity',
        description: 'We maintain the highest standards of honesty and ethical behavior.',
        icon: 'fas fa-shield-alt',
      },
      {
        id: 3,
        title: 'Collaboration',
        description: 'We believe in the power of teamwork and diverse perspectives.',
        icon: 'fas fa-users',
      },
    ]

    const contactInfo: ContactInfo = {
      address: '123 Innovation Drive, Tech City, TC 12345',
      email: 'hello@company.com',
      phone: '+1 (555) 123-4567',
    }

    return {
      title,
      subtitle,
      mission,
      teamMembers,
      companyValues,
      contactInfo,
    }
  },
})
</script>

<style scoped>
.about-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.hero-section {
  text-align: center;
  margin-bottom: 4rem;
}

.hero-section h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.subtitle {
  font-size: 1.5rem;
  color: #666;
}

.mission-section {
  margin-bottom: 4rem;
  text-align: center;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
}

.team-member {
  text-align: center;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.team-member img {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  margin-bottom: 1rem;
  object-fit: cover;
}

.role {
  color: #666;
  margin: 0.5rem 0;
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
}

.value-card {
  text-align: center;
  padding: 2rem;
  border-radius: 8px;
  background-color: #f8f9fa;
}

.value-card i {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #007bff;
}

.contact-section {
  text-align: center;
}

.contact-info {
  margin-top: 1.5rem;
}

.contact-info p {
  margin: 0.5rem 0;
}

@media (max-width: 768px) {
  .hero-section h1 {
    font-size: 2.5rem;
  }

  .subtitle {
    font-size: 1.25rem;
  }

  .team-grid,
  .values-grid {
    grid-template-columns: 1fr;
  }
}
</style>
