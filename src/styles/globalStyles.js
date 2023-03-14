import styled from "styled-components";

// Used for wrapping a page component
export const Screen = styled.div`
  background-color: var(--primary);
  background-image: linear-gradient(117deg, #fdf4fd, #ddccdb 19%, #c3c4e9 38%, #74cbe5);
  background-size: cover;
  background-position: center;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

// Used for providing space between components
export const SpacerXSmall = styled.div`
  height: 8px;
  width: 8px;
`;

// Used for providing space between components
export const SpacerSmall = styled.div`
  height: 16px;
  width: 16px;
`;

// Used for providing space between components
export const SpacerMedium = styled.div`
  height: 24px;
  width: 24px;
`;

// Used for providing space between components
export const SpacerLarge = styled.div`
  height: 32px;
  width: 32px;
`;

// Used for providing a wrapper around a component
export const Container = styled.div`
  display: flex;
  flex: ${({ flex }) => (flex ? flex : 0)};
  flex-direction: ${({ fd }) => (fd ? fd : "column")};
  justify-content: ${({ jc }) => (jc ? jc : "flex-start")};
  align-items: ${({ ai }) => (ai ? ai : "flex-start")};
  width: 100%;
  background-size: cover;
  background-position: center;
`;

export const TextCounter = styled.p`
  font-family: 'Share Tech Mono', monospace;
  color: var(--primary-text);
`

export const TextTitle = styled.h1`
  font-family: 'Luckiest Guy', sans-serif;
  color: var(--primary-text);
  font-size: 22px;
  font-weight: 500;
  line-height: 1.6;
`;

export const TextSubTitle = styled.p`
  color: var(--primary-text);
  font-size: 18px;
  line-height: 1.6;
`;

export const TextDescription = styled.p`
  color: var(--primary-text);
  font-size: 0.9rem;
  line-height: 1.6;
`;

export const StyledClickable = styled.div`
  :active {
    opacity: 0.6;
  }
`;

export const FeedbackBubble = styled.div`
  background: var(--accent-light);
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  color: var(--accent);
  line-height: 1.2;
  font-weight: 300;
`

export const NoteBubble = styled.div`
  background: rgba(255, 255, 255, 0.8);
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  font-size: 0.9rem;
  line-height: 1.6;
`

export const Footer = styled.div`
  background: var(--primary);
  padding: 0.5rem 1rem;
  color: #fff;
  display: flex;
  justify-content: space-between;
`
export const FooterItem = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.8rem;
  img {
    margin-bottom: -0.125rem;
  }
  a, span {
    color: #fff;
    text-decoration: none;
    margin-right: 0.5rem;
    margin-left: 0.5rem;
    &:first-child {
      margin-left: 0;
    }
  }
  a {
    font-weight: 800;
  }
  span {
    font-weight: 100;
  }
`

export const FooterPartners = styled.div`
  background: var(--primary);
  img {
    width: 100%;
    padding: 1.5rem;
  }
  justify-content: stretch;
  justify-items: center;
  align-items: center;
  display: grid;
  padding: 2rem;
  padding-left: 1rem;
  @media (min-width: 767px) {
    grid-template-columns: 10% 9% 9% 9% 9% 9% 9% 9% 9% 9% 9%;
  }
  grid-template-columns: 50% 50%;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
`

export const FooterPartnersTitle = styled.div`
  color: #fff;
  font-size: 1rem;
  width: 100%;
  font-weight: 800;
  text-align: left;
`

export const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  * {
    margin-left: 0.25rem;
    margin-right: 0.25rem;
    @media (min-width: 767px) {
      margin-left: 0.5rem;
      margin-right: 0.5rem;
    }
  }
`