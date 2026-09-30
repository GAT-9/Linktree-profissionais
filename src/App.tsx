import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  ChevronDown,
  ExternalLink,
  Instagram,
  MapPin,
  type LucideIcon,
} from "lucide-react";
import unitImage from "./assets/Icon-perfil-USF.png";

type LinkItem = { label: string; url: string };
type Category = {
  id: string;
  title: string;
  marker: string;
  links: LinkItem[];
};

const categories: Category[] = [
  {
    id: "servicos",
    marker: "01",
    title: "Serviços",
    links: [
      { label: "Vacinação", url: "#vacinacao" },
      { label: "Consulta médica", url: "#consulta-medica" },
      { label: "Atendimento de enfermagem", url: "#enfermagem" },
      { label: "Odontologia", url: "#odontologia" },
      { label: "Farmácia", url: "#farmacia" },
      { label: "Pré-natal", url: "#pre-natal" },
      { label: "Curativos", url: "#curativos" },
      { label: "Acompanhamento de hipertensão", url: "#hipertensao" },
      { label: "Acompanhamento de diabetes", url: "#diabetes" },
      { label: "Visita domiciliar", url: "#visita-domiciliar" },
      { label: "Planejamento familiar", url: "#planejamento-familiar" },
    ],
  },
  {
    id: "profissionais",
    marker: "02",
    title: "Área dos Profissionais",
    links: [
      { label: "Documentos internos", url: "#documentos-internos" },
      { label: "Planilhas da equipe", url: "#planilhas" },
      { label: "Protocolos assistenciais", url: "#protocolos" },
      { label: "Drives compartilhados", url: "#drives" },
      { label: "Sistemas de trabalho", url: "#sistemas" },
    ],
  },
  {
    id: "documentos",
    marker: "03",
    title: "Documentos",
    links: [
      { label: "Formulários", url: "#formularios" },
      { label: "Declarações", url: "#declaracoes" },
      { label: "Orientações ao paciente", url: "#orientacoes" },
      { label: "Documentos institucionais", url: "#institucionais" },
    ],
  },
  {
    id: "links-uteis",
    marker: "04",
    title: "Links Úteis",
    links: [
      { label: "Ministério da Saúde", url: "https://www.gov.br/saude/" },
      {
        label: "Secretaria de Saúde da Bahia",
        url: "https://www.saude.ba.gov.br/",
      },
      { label: "e-SUS APS", url: "https://sisaps.saude.gov.br/esus/" },
      { label: "Meu SUS Digital", url: "https://meususdigital.saude.gov.br/" },
    ],
  },
  {
    id: "campanhas",
    marker: "05",
    title: "Campanhas",
    links: [
      { label: "Calendário de vacinação", url: "#calendario-vacinacao" },
      { label: "Campanhas em andamento", url: "#campanhas-ativas" },
      { label: "Ações na comunidade", url: "#acoes-comunidade" },
    ],
  },
  {
    id: "horarios",
    marker: "06",
    title: "Horários",
    links: [
      { label: "Atendimento geral", url: "#atendimento-geral" },
      { label: "Sala de vacina", url: "#sala-vacina" },
      { label: "Farmácia da unidade", url: "#horario-farmacia" },
    ],
  },
];

function SocialLink({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
}) {
  return (
    <a
      className="social-link"
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Icon aria-hidden="true" />
    </a>
  );
}

function Header() {
  return (
    <header className="profile-header">
      <div className="profile-image-wrap">
        <img
          className="profile-image"
          src={unitImage}
          alt="Fachada da USF Andaia"
        />
        <span className="profile-status" aria-label="Unidade ativa" />
      </div>
      <p className="eyebrow">Unidade de Saúde da Família</p>
      <h1>USF - Andaia Profissionais</h1>
      <p className="profile-description">
        Informação e cuidado mais perto de você. Encontre serviços, documentos e
        canais da unidade.
      </p>
      <nav className="social-links" aria-label="Redes sociais e localização">
        <SocialLink
          href="https://www.instagram.com/usf.andaia/"
          label="Instagram da USF Andaia"
          icon={Instagram}
        />
        <SocialLink
          href="https://maps.app.goo.gl/9jHKHQKAVoXtEGfy5"
          label="Localização da USF Andaia"
          icon={MapPin}
        />
      </nav>
    </header>
  );
}

function DropdownItem({ item, isOpen }: { item: LinkItem; isOpen: boolean }) {
  const external = item.url.startsWith("http");
  return (
    <li>
      <a
        className="dropdown-item"
        href={item.url}
        tabIndex={isOpen ? 0 : -1}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        <span>{item.label}</span>
        <ExternalLink aria-hidden="true" />
      </a>
    </li>
  );
}

type MenuPlacement = { side: "top" | "bottom"; maxHeight: number };

function DropdownMenu({
  category,
  placement,
  isOpen,
}: {
  category: Category;
  placement: MenuPlacement;
  isOpen: boolean;
}) {
  return (
    <div
      id={`menu-${category.id}`}
      className={`dropdown-menu dropdown-menu--${placement.side} ${isOpen ? "dropdown-menu--open" : ""}`}
      role="region"
      aria-label={`Links de ${category.title}`}
      aria-hidden={!isOpen}
      style={{ maxHeight: placement.maxHeight }}
    >
      <ul>
        {category.links.map((item) => (
          <DropdownItem
            key={`${category.id}-${item.label}`}
            item={item}
            isOpen={isOpen}
          />
        ))}
      </ul>
    </div>
  );
}

function DropdownButton({
  category,
  isOpen,
  onToggle,
  onButtonRef,
  placement,
}: {
  category: Category;
  isOpen: boolean;
  onToggle: () => void;
  onButtonRef: (element: HTMLButtonElement | null) => void;
  placement: MenuPlacement;
}) {
  return (
    <div className={`dropdown ${isOpen ? "dropdown--open" : ""}`}>
      <button
        ref={onButtonRef}
        className="category-button"
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`menu-${category.id}`}
        aria-haspopup="true"
      >
        <span className="category-marker" aria-hidden="true">
          {category.marker}
        </span>
        <span className="category-title">{category.title}</span>
        <ChevronDown className="category-chevron" aria-hidden="true" />
      </button>
      <DropdownMenu category={category} placement={placement} isOpen={isOpen} />
    </div>
  );
}

function Home() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [placement, setPlacement] = useState<MenuPlacement>({
    side: "bottom",
    maxHeight: 320,
  });
  const pageRef = useRef<HTMLElement>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const closeMenu = useCallback(() => setOpenId(null), []);

  const updatePlacement = useCallback(() => {
    if (!openId) return;
    const button = buttonRefs.current[openId];
    if (!button) return;
    const rect = button.getBoundingClientRect();
    const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
    const safeGap = 18;
    const preferredMax = Math.min(viewportHeight * 0.46, 360);
    const availableBelow = viewportHeight - rect.bottom - safeGap;
    const availableAbove = rect.top - safeGap;
    const side =
      availableBelow >= Math.min(220, preferredMax) ||
      availableBelow >= availableAbove
        ? "bottom"
        : "top";
    const available = side === "bottom" ? availableBelow : availableAbove;
    setPlacement({
      side,
      maxHeight: Math.max(128, Math.min(preferredMax, available)),
    });
  }, [openId]);

  useLayoutEffect(updatePlacement, [updatePlacement]);
  useEffect(() => {
    if (!openId) return;
    const handlePointerDown = (event: PointerEvent) => {
      const activeDropdown = buttonRefs.current[openId]?.parentElement;
      if (!activeDropdown?.contains(event.target as Node)) closeMenu();
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        const button = buttonRefs.current[openId];
        closeMenu();
        button?.focus();
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", updatePlacement);
    window.addEventListener("scroll", updatePlacement, true);
    window.visualViewport?.addEventListener("resize", updatePlacement);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", updatePlacement);
      window.removeEventListener("scroll", updatePlacement, true);
      window.visualViewport?.removeEventListener("resize", updatePlacement);
    };
  }, [closeMenu, openId, updatePlacement]);

  return (
    <main className="site-shell" ref={pageRef}>
      <article className="link-card">
        <div className="card-accent" aria-hidden="true" />
        <Header />
        <section className="link-section" aria-labelledby="quick-links-title">
          <div className="section-heading">
            <p id="quick-links-title">Acessos rápidos</p>
            <span>{categories.length} categorias</span>
          </div>
          <div className="category-list">
            {categories.map((category) => (
              <DropdownButton
                key={category.id}
                category={category}
                isOpen={openId === category.id}
                onToggle={() =>
                  setOpenId((current) =>
                    current === category.id ? null : category.id,
                  )
                }
                onButtonRef={(element) => {
                  buttonRefs.current[category.id] = element;
                }}
                placement={placement}
              />
            ))}
          </div>
        </section>
        <footer className="card-footer">
          <span aria-hidden="true" />
          <p>Desenvolvido por :  GAT 9</p>
          <span aria-hidden="true" />
        </footer>
      </article>
    </main>
  );
}

export default Home;
