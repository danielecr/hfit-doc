// Initialize Mermaid with proper configuration for Material theme
document.addEventListener('DOMContentLoaded', function() {
    mermaid.initialize({
        startOnLoad: true,
        theme: 'default',
        themeVariables: {
            primaryColor: '#3f51b5',
            primaryTextColor: '#fff',
            primaryBorderColor: '#303f9f',
            lineColor: '#757575',
            sectionBkgColor: '#e8eaf6',
            altSectionBkgColor: '#f5f5f5',
            gridColor: '#e0e0e0',
            secondaryColor: '#ff4081',
            tertiaryColor: '#f1f8e9'
        },
        securityLevel: 'loose',
        flowchart: {
            nodeSpacing: 50,
            rankSpacing: 50,
            curve: 'basis'
        },
        sequence: {
            diagramMarginX: 50,
            diagramMarginY: 10,
            actorMargin: 50,
            width: 150,
            height: 65,
            boxMargin: 10,
            boxTextMargin: 5,
            noteMargin: 10,
            messageMargin: 35,
            mirrorActors: true,
            bottomMarginAdj: 1,
            useMaxWidth: true
        },
        gitgraph: {
            mainBranchName: 'main',
            showCommitLabel: true,
            showBranches: true,
            rotateCommitLabel: true
        }
    });
});