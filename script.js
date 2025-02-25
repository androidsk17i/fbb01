function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (prefersDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.checked = true;
    }

    themeToggle.addEventListener('change', function() {
        document.documentElement.setAttribute('data-theme', 
            this.checked ? 'dark' : 'light'
        );
    });

    // Initial scroll check
    handleScroll();
}

function showCopyNotification() {
    const notification = document.getElementById('copyNotification');
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
}

function getSelectedValues(selectId) {
    const select = document.getElementById(selectId);
    // For all categories, only take the first selected option
    const selectedOptions = Array.from(select.selectedOptions);
    return selectedOptions.length > 0 ? [selectedOptions[0].value] : [];
}

function generatePrompt() {
    const basePrompt = document.getElementById('basePrompt').value.trim();
    
    // Get selected values from all categories (now only one option per category)
    const selectedCountry = getSelectedValues('country');
    const selectedShots = getSelectedValues('shotType');
    const selectedScenes = getSelectedValues('scene');
    const selectedFacial = getSelectedValues('facial');
    const selectedClothing = getSelectedValues('clothing');
    const selectedPoses = getSelectedValues('pose');

    // Photography style details
    const photoStyles = [
        "candid amateur photography",
        "natural lighting",
        "documentary style",
        "slice of life",
        "authentic moment",
        "unposed",
        "spontaneous capture"
    ];

    // Physical attributes and details
    const physicalDetails = [
        "muscular definition",
        "athletic build",
        "powerful physique",
        "well-developed muscles",
        "strong feminine features",
        "curvaceous figure",
        "impressive muscle tone"
    ];

    // Quality enhancers for JuggernautXL
    const qualityEnhancers = [
        "hyperrealistic",
        "photorealistic",
        "detailed skin texture",
        "sharp focus",
        "high resolution",
        "professional photography",
        "cinematic lighting",
        "8k UHD",
        "detailed features"
    ];

    // Randomly select some elements from each array
    const getRandomElements = (arr, count) => {
        const shuffled = [...arr].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    };

    // Build the prompt components (no need to join with commas since there's only one value)
    const country = selectedCountry.length > 0 ? selectedCountry[0] : "Asian";
    const shotType = selectedShots.length > 0 ? selectedShots[0] : getRandomElements(["medium shot", "full body"], 1)[0];
    const scene = selectedScenes.length > 0 ? selectedScenes[0] : "";
    const facial = selectedFacial.length > 0 ? selectedFacial[0] : "";
    const clothing = selectedClothing.length > 0 ? selectedClothing[0] : "";
    const pose = selectedPoses.length > 0 ? selectedPoses[0] : "";

    // Build the enhanced prompt
    let enhancedPrompt = `RAW photo, ${getRandomElements(photoStyles, 2).join(", ")}, ${shotType}, beautiful 40 years old ${getRandomElements(physicalDetails, 3).join(", ")} ${country} woman bodybuilder, chubby, busty, huge breasts`;

    // Add optional components if selected
    if (scene) enhancedPrompt += `, in ${scene}`;
    if (facial) enhancedPrompt += `, ${facial} expression`;
    if (clothing) enhancedPrompt += `, wearing ${clothing}`;
    if (pose) enhancedPrompt += `, ${pose}`;

    // Add quality enhancers and final touches
    enhancedPrompt += `, ${getRandomElements(qualityEnhancers, 3).join(", ")}, masterpiece, best quality, realistic lighting, textured skin, intricate details, professional photography`;

    // Add any custom prompt elements
    if (basePrompt) {
        enhancedPrompt += `, ${basePrompt}`;
    }

    // Remove duplicate words before setting the final prompt
    enhancedPrompt = removeDuplicateWords(enhancedPrompt);

    document.getElementById('outputPrompt').textContent = enhancedPrompt;
    copyToClipboard(false); // Automatically copy to clipboard without alert
}

function randomizeAll() {
    // Handle multiple select elements
    const selects = document.querySelectorAll('select[multiple]');
    selects.forEach(select => {
        // Clear current selections
        Array.from(select.selectedOptions).forEach(option => option.selected = false);
        
        // Randomly select only ONE option
        const options = Array.from(select.options);
        const randomIndex = Math.floor(Math.random() * options.length);
        options[randomIndex].selected = true;
    });

    // Handle country select
    const countrySelect = document.getElementById('country');
    const countryOptions = Array.from(countrySelect.options).slice(1); // Skip the first "Select Origin" option
    const randomIndex = Math.floor(Math.random() * countryOptions.length);
    countrySelect.value = countryOptions[randomIndex].value;
    
    // Generate and copy prompt automatically
    generatePrompt();
    copyToClipboard(false);
}

function clearAll() {
    const selects = document.querySelectorAll('select[multiple]');
    selects.forEach(select => {
        Array.from(select.selectedOptions).forEach(option => option.selected = false);
    });
    // Clear country select
    document.getElementById('country').value = '';
    document.getElementById('basePrompt').value = '';
    document.getElementById('outputPrompt').textContent = '';
}

function copyToClipboard(showAlert = true) {
    const outputText = document.getElementById('outputPrompt').textContent;
    navigator.clipboard.writeText(outputText).then(() => {
        if (showAlert) {
            showCopyNotification();
        }
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
}

// Add this new function to remove duplicates
function removeDuplicateWords(prompt) {
    // Split into words, keeping punctuation
    const words = prompt.split(/\s*,\s*/);
    const seen = new Set();
    const uniqueWords = words.filter(word => {
        // Convert to lowercase for comparison but keep original case
        const lowerWord = word.toLowerCase().trim();
        if (seen.has(lowerWord)) {
            return false;
        }
        seen.add(lowerWord);
        return true;
    });
    return uniqueWords.join(", ");
}

// Add these new functions
function handleScroll() {
    const backToTopButton = document.getElementById('backToTop');
    if (window.scrollY > 300) {
        backToTopButton.classList.add('visible');
    } else {
        backToTopButton.classList.remove('visible');
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
}); 