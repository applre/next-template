import type { Meta, StoryObj } from '@storybook/react';
import { LoadingButton } from './LoadingButton';
import { useState } from 'react';
import { userEvent, within, expect } from '@storybook/test';

const meta: Meta<typeof LoadingButton> = {
  title: 'Components/LoadingButton',
  component: LoadingButton,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
    size: {
      control: 'select',
      options: ['lg', 'default', 'sm', 'icon'],
    },
    loading: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof LoadingButton>;

// Default story
export const Default: Story = {
  args: {
    children: 'Click me',
    loading: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByText('Click me');
    await expect(button).toBeInTheDocument();
    await expect(canvas.queryByTestId('spinner')).not.toBeInTheDocument();
  },
};

// Loading state story
export const Loading: Story = {
  args: {
    children: 'Loading...',
    loading: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const text = canvas.getByText('Loading...');
    await expect(text).toHaveClass('opacity-0');
    await expect(canvas.getByTestId('spinner')).toBeInTheDocument();
  },
};

// Different variants showcase
export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <LoadingButton variant="default">Default</LoadingButton>
      <LoadingButton variant="destructive">Destructive</LoadingButton>
      <LoadingButton variant="outline">Outline</LoadingButton>
      <LoadingButton variant="secondary">Secondary</LoadingButton>
      <LoadingButton variant="ghost">Ghost</LoadingButton>
      <LoadingButton variant="link">Link</LoadingButton>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const variants = ['Default', 'Destructive', 'Outline', 'Secondary', 'Ghost', 'Link'];

    for (const variant of variants) {
      await expect(canvas.getByText(variant)).toBeInTheDocument();
    }
  },
};

// Different sizes showcase
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <LoadingButton size="lg">Large</LoadingButton>
      <LoadingButton size="default">Default</LoadingButton>
      <LoadingButton size="sm">Small</LoadingButton>
      <LoadingButton size="icon">
        <span>★</span>
      </LoadingButton>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Large')).toBeInTheDocument();
    await expect(canvas.getByText('Default')).toBeInTheDocument();
    await expect(canvas.getByText('Small')).toBeInTheDocument();
    await expect(canvas.getByText('★')).toBeInTheDocument();
  },
};

// Interactive example with loading state toggle
export const Interactive: Story = {
  render: function Render() {
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = () => {
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 2000);
    };

    return (
      <LoadingButton loading={isLoading} onClick={handleClick} disabled={isLoading}>
        {isLoading ? 'Processing...' : 'Click to load'}
      </LoadingButton>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Initial state
    const button = canvas.getByText('Click to load');
    await expect(button).toBeInTheDocument();
    await expect(canvas.queryByTestId('spinner')).not.toBeInTheDocument();

    // Click and check loading state
    await userEvent.click(button);
    const processingText = canvas.getByText('Processing...');
    await expect(processingText).toHaveClass('opacity-0');
    await expect(canvas.getByTestId('spinner')).toBeInTheDocument();

    // Wait for loading to complete
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await expect(canvas.getByText('Click to load')).toBeInTheDocument();
    await expect(canvas.queryByTestId('spinner')).not.toBeInTheDocument();
  },
};

// Disabled state
export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    disabled: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByText('Disabled Button');
    await expect(button).toBeInTheDocument();
    await expect(button.closest('button')).toBeDisabled();
  },
};

// Loading with different variants
export const LoadingVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <LoadingButton loading variant="default">
        Default
      </LoadingButton>
      <LoadingButton loading variant="destructive">
        Destructive
      </LoadingButton>
      <LoadingButton loading variant="outline">
        Outline
      </LoadingButton>
      <LoadingButton loading variant="secondary">
        Secondary
      </LoadingButton>
      <LoadingButton loading variant="ghost">
        Ghost
      </LoadingButton>
      <LoadingButton loading variant="link">
        Link
      </LoadingButton>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const variants = ['Default', 'Destructive', 'Outline', 'Secondary', 'Ghost', 'Link'];

    for (const variant of variants) {
      const button = canvas.getByText(variant);
      await expect(button).toBeInTheDocument();
      await expect(button).toHaveClass('opacity-0');
      await expect(button.closest('button')).toBeDisabled();
    }

    // Check spinners
    const spinners = canvas.queryAllByTestId('spinner');
    await expect(spinners).toHaveLength(variants.length);
  },
};
