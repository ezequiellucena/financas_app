import svgPaths from "./svg-u4bp11a6nn";

function Component() {
  return (
    <div className="h-[21.486px] relative shrink-0 w-[17.749px]" data-name="Component 18">
      <div className="absolute inset-[-1.36%_-4.23%_-3.49%_-4.23%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.2492 22.529">
          <g id="Component 18">
            <path d={svgPaths.p2a202800} id="Vector 10" stroke="var(--stroke-0, #585858)" strokeLinecap="round" strokeWidth="1.5" />
            <path d={svgPaths.p16c13780} id="Vector 13" stroke="var(--stroke-0, #585858)" strokeLinecap="round" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex flex-col gap-[1.98px] items-center px-[11.878px] py-[7.919px] relative rounded-[98.984px] shrink-0">
      <Component />
      <p className="[word-break:break-word] font-['Poppins:Medium',sans-serif] leading-[15.837px] not-italic relative shrink-0 text-[#585858] text-[11.878px] whitespace-nowrap">Início</p>
    </div>
  );
}

function Group() {
  return (
    <div className="h-[23.276px] relative shrink-0 w-[18.461px]">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.4606 23.2764">
        <g id="Group 10350">
          <path d={svgPaths.p2a5c7b40} id="Rectangle 1495" stroke="var(--stroke-0, #585858)" strokeWidth="1.5" />
          <path d={svgPaths.pd3b8200} fill="var(--fill-0, #585858)" id="$" />
        </g>
      </svg>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex flex-col gap-[1.98px] items-center px-[11.878px] py-[7.919px] relative rounded-[98.984px] shrink-0">
      <Group />
      <p className="[word-break:break-word] font-['Poppins:Medium',sans-serif] leading-[15.837px] not-italic relative shrink-0 text-[#585858] text-[10px] whitespace-nowrap">Faturas</p>
    </div>
  );
}

function Menu() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-[84.136px]" data-name="Menu 8">
      <Frame1 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex gap-[7px] items-center pl-[17px] pr-[12px] relative shrink-0 w-[149px]">
      <Frame />
      <Menu />
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex flex-col gap-[1.98px] items-center px-[11.878px] py-[7.919px] relative rounded-[98.984px] shrink-0">
      <div className="h-[23px] relative shrink-0 w-[22px]" data-name="settings">
        <div className="absolute inset-[-3.26%_-2.74%_-3.26%_-2.65%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23.185 24.5">
            <path d={svgPaths.p1e826080} id="settings" stroke="var(--stroke-0, #585858)" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
      <p className="[word-break:break-word] font-['Poppins:Medium',sans-serif] leading-[15.837px] not-italic relative shrink-0 text-[#585858] text-[10px] whitespace-nowrap">Config</p>
    </div>
  );
}

function Menu1() {
  return (
    <div className="content-stretch flex flex-col items-center mr-[-20px] relative shrink-0 w-[83.146px]" data-name="Menu 9">
      <Frame2 />
    </div>
  );
}

function ImoveisColor() {
  return (
    <div className="h-[23.002px] relative shrink-0 w-[23.922px]" data-name="Imóveis-color">
      <div className="absolute inset-[-2.44%_-0.69%_-0.65%_-3.95%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 25.033 23.713">
          <g id="ImÃ³veis-color">
            <path d={svgPaths.p38325500} fill="var(--fill-0, #585858)" id="Subtract" />
            <path d={svgPaths.p38559c00} fill="var(--fill-0, #585858)" id="Union" />
            <path d={svgPaths.p208e5200} fill="var(--fill-0, #585858)" id="Subtract_2" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-center relative shrink-0 w-[82px]">
      <ImoveisColor />
      <p className="[word-break:break-word] font-['Poppins:Medium',sans-serif] leading-[15.837px] not-italic relative shrink-0 text-[#585858] text-[10px] whitespace-nowrap">Meus imóveis</p>
    </div>
  );
}

function Menu2() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-center min-w-px relative" data-name="Menu 10">
      <Frame3 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-[169px]">
      <Menu1 />
      <Menu2 />
    </div>
  );
}

function BarraDeNavegacao() {
  return (
    <div className="-translate-x-1/2 absolute bg-[rgba(215,215,215,0.8)] bottom-0 content-stretch flex h-[57px] items-center justify-between left-1/2 py-[11px] rounded-[30px] w-[363px]" data-name="Barra de navegação">
      <div aria-hidden className="absolute border-[#eaeaea] border-[0.495px] border-solid inset-[-0.495px] pointer-events-none rounded-[30.495px] shadow-[0px_0px_7.919px_0px_rgba(0,0,0,0.1)]" />
      <Frame4 />
      <Frame5 />
    </div>
  );
}

function Group1() {
  return (
    <div className="h-[25px] relative shrink-0 w-[16.176px]">
      <div className="absolute inset-[-2%_-3.09%_-2.97%_0]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.6764 26.2419">
          <g id="Group 1261154801">
            <path d={svgPaths.p2893d780} fill="var(--fill-0, white)" id="Vector" />
            <path d={svgPaths.p321a900} id="Vector_2" stroke="var(--stroke-0, white)" />
            <path d="M8.41628 22.5152V25.4919" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p12c2180} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.pa892200} id="Vector_5" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame6() {
  return (
    <div className="absolute bg-gradient-to-r content-stretch drop-shadow-[0px_0px_3.959px_rgba(0,0,0,0.1)] flex flex-col from-[#85d24b] gap-[2px] items-center left-[151px] pb-[10px] pl-[17px] pr-[16px] pt-[9px] rounded-[30px] size-[60px] to-[#009fc2] top-0">
      <div aria-hidden className="absolute border-2 border-[#85d24b] border-solid inset-[-2px] pointer-events-none rounded-[32px]" />
      <Group1 />
      <p className="[word-break:break-word] font-['Poppins:Medium',sans-serif] leading-[15.837px] not-italic relative shrink-0 text-[10px] text-white whitespace-nowrap">GisA</p>
    </div>
  );
}

export default function Group2() {
  return (
    <div className="relative size-full">
      <BarraDeNavegacao />
      <Frame6 />
    </div>
  );
}