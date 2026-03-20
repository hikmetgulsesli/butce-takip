import '@testing-library/jest-dom'

// Mock ResizeObserver for recharts
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// eslint-disable-next-line no-undef
global.ResizeObserver = ResizeObserverMock

// Mock getBoundingClientRect for recharts ResponsiveContainer
// eslint-disable-next-line no-undef
Object.defineProperty(Element.prototype, 'getBoundingClientRect', {
  writable: true,
  value: () => ({
    width: 500,
    height: 280,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  }),
})