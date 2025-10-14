import { Component } from '@angular/core';
import "@tsparticles/engine";
import "@tsparticles/angular";
import "@tsparticles/slim";
import { NgParticlesService, NgxParticlesModule } from '@tsparticles/angular';
import { Container } from '@tsparticles/engine';
import { loadSlim } from '@tsparticles/slim';
@Component({
  selector: 'app-particles-component',
  imports: [NgxParticlesModule],
  templateUrl: './particles-component.html',
  styleUrl: './particles-component.css'
})
export class ParticlesComponent {
  id = "tsparticles";
  model = {};
  particlesOptions = {
    background: {
      color: {
        value: "transparent",
      }
    },
    fpsLimit: 120,
    interactivity: {
      events: {
        onClick: {
          enable: true,
          mode: 'push' as const,
        },
        onHover: {
          enable: true,
          mode: 'repulse' as const,
        },

      },
      modes: {
        push: {
          quantity: 3,
        },
        repulse: {
          distance: 150,
          duration: 2,
        },
      },
    },
    particles: {
      color: {
        value: "#0096bbff",
      },
      links: {
        color: "#002fffff",
        distance: 250,
        enable: true,
        opacity: 0.5,
        width: 1,
      },
      move: {
        direction: 'none' as const,
        enable: true,
        outModes: {
          default: 'bounce' as const,
        },
        random: false,
        speed: 2,
        straight: false,
      },
      number: {
        density: {
          enable: true,
          area: 800,
        },
        value: 150,
      },
      opacity: {
        value: 0.5,
      },
      shape: {
        type: "circle",
      },
      size: {
        value: { min: 2, max: 5 },
      },
    },
    detectRetina: true,
  };

  constructor(private readonly ngParticlesService: NgParticlesService) { }

  ngOnInit(): void {
    this.ngParticlesService.init(async (engine) => {
      console.log(engine);

      // Starting from 1.19.0 you can add custom presets or shape here, using the current tsParticles instance (main)
      // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
      // starting from v2 you can add only the features you need reducing the bundle size
      //await loadFull(engine);
      await loadSlim(engine);
    });
    if (this.model === "no-b") {
      this.particlesOptions.background = {
        color: { value: "transparent" }
      }
    }
  }

  particlesLoaded(container: Container): void {
    console.log(container);
  }
}
