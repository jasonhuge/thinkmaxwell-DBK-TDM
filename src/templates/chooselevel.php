<ul>
	<?php
    	$levels = $json['game']['levels'];
    	
    	foreach ($levels as $level) {
        	echo '<li class="level"><div class="level-content">';
			echo '<h3>'.$level['desc'].'</h3>';
			echo '<div class="level-button button" data-id="'.$level['id'].'">'.$level['title'].'<img src="" alt=""/></div>';
			echo '</div></li>';
    	}
    ?>
</ul>