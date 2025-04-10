
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: '#007FFF', // Electric Blue
					foreground: '#FFFFFF',
					hover: '#0078EA',
				},
				secondary: {
					DEFAULT: '#0F172A', // Deep Slate
					foreground: '#FFFFFF',
				},
				accent: {
					DEFAULT: '#00FFD1', // Vibrant Mint
					foreground: '#0F172A',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: '#64748B' // Text Secondary
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				card: {
					DEFAULT: '#FFFFFF',
					foreground: '#0F172A',
				},
				popover: {
					DEFAULT: '#FFFFFF',
					foreground: '#0F172A',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			fontFamily: {
				sans: ['Inter', 'sans-serif'],
				serif: ['"DM Serif Display"', 'serif'],
			},
			boxShadow: {
				'workout-card': '0 10px 15px -3px rgba(0, 127, 255, 0.1), 0 4px 6px -2px rgba(0, 127, 255, 0.05)',
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' },
				},
				'badge-unlock': {
					'0%': { transform: 'scale(0.8)', opacity: '0' },
					'50%': { transform: 'scale(1.2)', opacity: '1' },
					'100%': { transform: 'scale(1)', opacity: '1' },
				},
				'pulse-glow': {
					'0%, 100%': {
						opacity: '1',
						boxShadow: '0 0 0 rgba(0, 255, 209, 0)',
					},
					'50%': {
						opacity: '0.85',
						boxShadow: '0 0 15px rgba(0, 255, 209, 0.5)',
					},
				},
				'slide-in': {
					'0%': { transform: 'translateY(10px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'badge-unlock': 'badge-unlock 0.5s ease-out forwards',
				'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
				'slide-in': 'slide-in 0.3s ease-out',
			},
			backgroundImage: {
				'primary-gradient': 'linear-gradient(to right, #007FFF, #00C6FF)',
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
